export const dummy = {
  channel_id: `${context.params.event.channel_id}`,
  content: `@everyone `,
  tts: false,
  components: [
    {
      type: 1,
      components: [
        {
          style: 5,
          label: `Open Github`,
          url: `https://p.kindpng.com/picc/s/222-2227825_want-you-to-make-disgusted-face-hd-png.png`,
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
      title: `New Commit Added`,
      description: `asdasdasdasdasdasdasdasd`,
      color: 0x212ea1,
      fields: [
        {
          name: `amsd,amsnd,`,
          value: `asdasd`,
        },
        {
          name: `asdasd`,
          value: `asdasdasd`,
        },
        {
          name: `kasjdkjansdjknkjn`,
          value: `asdasdasdasda`,
        },
      ],
      timestamp: `2022-01-01T00:00:00.000Z`,
      image: {
        url: `https://p.kindpng.com/picc/s/222-2227825_want-you-to-make-disgusted-face-hd-png.png`,
        height: 0,
        width: 0,
      },
      author: {
        name: `asdasdasdas`,
        url: `https://p.kindpng.com/picc/s/222-2227825_want-you-to-make-disgusted-face-hd-png.png`,
        icon_url: `asdas`,
        proxy_icon_url: `asd`,
      },
      footer: {
        text: `akjsndjkasndkajsndkjnknknkn`,
      },
      url: `https://p.kindpng.com/picc/s/222-2227825_want-you-to-make-disgusted-face-hd-png.png`,
    },
  ],
};
