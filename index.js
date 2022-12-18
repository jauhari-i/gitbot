require("dotenv").config();
require("@google-cloud/debug-agent").start({
  serviceContext: {
    service: "default",
    version: "20221217t010710",
    enableCanary: true,
  },
});
const winston = require("winston");
const { LoggingWinston } = require("@google-cloud/logging-winston");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 500000,
  })
);

const loggingWinston = new LoggingWinston();

const logger = winston.createLogger({
  level: "info",
  transports: [new winston.transports.Console(), loggingWinston],
});

const {
  Client,
  Events,
  Collection,
  GatewayIntentBits,
  ActivityType,
} = require("discord.js");

const { token } = process.env;

const fs = require("node:fs");
const path = require("path");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c) => {
  c.user.setPresence({
    activities: [{ name: "Your Repository", type: ActivityType.Listening }],
    status: "idle",
  });
  console.log("Ready as " + c.user.tag);
});

client.commands = new Collection();
client.slashCommands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath)(client, logger);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.login(token);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    logger.info("Excecuting command");
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    logger.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

// [START gae_node_request_example]

app.get("/", (req, res) => {
  res.status(200).send("Hello, world!").end();
});

app.post("/", async (req, res) => {
  try {
    const { data } = req.body;

    console.log(data);
    logger.data(data);

    const payload = data;

    const message = {
      content: "@everyone",
      tts: false,
      components: [
        {
          type: 1,
          components: [
            {
              style: 5,
              label: `Open Github`,
              url: payload.compare,
              disabled: false,
              type: 2,
            },
          ],
        },
      ],
      allowed_mentions: {
        replied_user: false,
        parse: ["everyone"],
      },
      embeds: [
        {
          type: "rich",
          title: "New Commit Added",
          description: `Added [${payload.head_commit.added.length}] Modified [${payload.head_commit.modified.length}] Removed [${payload.head_commit.removed.length}]`,
          color: 0x212ea1,
          fields: [
            {
              name: "Updated By",
              value: payload.sender.login,
            },
            {
              name: "Updated Ref",
              value: payload.ref,
            },
          ],
          timestamp: new Date().toISOString(),
          image: {
            url: `https://p.kindpng.com/picc/s/222-2227825_want-you-to-make-disgusted-face-hd-png.png`,
            height: 0,
            width: 0,
          },
          author: {
            name: payload.sender.login,
            icon_url: payload.sender.avatar_url,
          },
          footer: {
            text: "Bot Made By Me",
          },
          url: payload.head_commit.url,
        },
      ],
    };

    const channel = await client.channels.fetch("1049174771683827743");

    await channel.send(message);
    return res.status(200);
  } catch (error) {
    logger.error(error);
    return res.status(500).json(error);
  }
});

app.get("/dummy", async (req, res) => {
  try {
    const channel = await client.channels.fetch("1049174771683827743");

    channel.send({ content: "Test" });

    console.log(channel);
  } catch (error) {
    return res.status(500).json(error);
  }
});

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
