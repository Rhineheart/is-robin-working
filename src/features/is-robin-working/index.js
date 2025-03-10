const utils = require("../../utils");
const Store = require("../../state");

const { nextWorkingDate } = require("./next-working-date");

const reactions = [
  {
    check: /^is\s+(robin|<:pizzarobin:1024343299487698974>)\s+working\??$/i,
    callback: (state, event) => {
      if (state.isWorking) {
        event.reply("yes!");
        return;
      }

      const nextDate = nextWorkingDate(state.isWorking);
      const nextDateString = utils.isTomorrow(nextDate)
        ? "tomorrow"
        : `${nextDate.getDate()}/${nextDate.getMonth() + 1}`;

      event.reply(`no, but he'll be back ${nextDateString}!`);
    },
  },

  {
    check: /^is\s+robin\s+working\s+tomorrow\??$/i,
    callback: (state, event) => {
      const nextDate = nextWorkingDate(state.isWorking);

      if (utils.isTomorrow(nextDate)) {
        event.reply("yes!");
        return;
      }

      const nextDateString = `${nextDate.getDate()}/${nextDate.getMonth() + 1}`;

      event.reply(`no, but he'll be back ${nextDateString}!`);
    },
  },

  {
    check: /^\/is-robin-working (no|yes)$/i,
    callback: (state, event) => {
      const nextDate = nextWorkingDate(state.isWorking);
      const [_, nextState] = event.content.split(" ");

      switch (nextState.toLowerCase()) {
        case "yes":
          if (state.isWorking === true) {
            event.reply("yes I already know he's working today...");
            return;
          }

          Store.update(() => ({ isWorking: true }));
          event.reply("ok, everyone will be happy Robin is working today!");
          return;

        case "no":
          if (state.isWorking === false) {
            event.reply("yes I already know he's not working today...");
            return;
          }

          Store.update(() => ({ isWorking: false }));
          event.reply("ok, I hope Robin has a nice day off work!");
          return;
      }
    },
  },
];

function use(client) {
  client.on("messageCreate", (event) => {
    if (event.author && event.author.id === "1107944006735904798") return;

    const state = Store.get();
    const content = event.content.trim();

    for (const reaction of reactions) {
      if (reaction.check.test(content)) {
        reaction.callback(state, event);
        return;
      }
    }
  });

  client.on("ready", async () => {
    try {
      await warmup();

      refreshState();
      setInterval(refreshState, 1000 * 60 * 60);
    } catch (err) {
      console.error("Failed to start is-robin-working:", err);
      process.exit(1);
    }
  });
}

async function warmup() {
  const defaultState = {
    isWorking: false,
    lastUpdateMs: 0,
  };

  return Store.update((state) => {
    return {
      ...defaultState,
      ...state,
    };
  });
}

function refreshState() {
  console.log("running update!");

  return Store.update((state) => {
    const lastUpdateDate = new Date(state.lastUpdateMs).getDate();
    const today = new Date();
    const date = today.getDate();

    if (date === lastUpdateDate) return state;

    const lastUpdateMs = today.getTime();

    return utils.isWeekend(today)
      ? { lastUpdateMs }
      : { lastUpdateMs, isWorking: !state.isWorking };
  });
}

module.exports = {
  use,
};
