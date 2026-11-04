import type { ComposerItemValue } from "@/registry/default/ui/composer";

export type Emoji = {
  emoji: string;
  shortcode: string;
  keywords: readonly string[];
};

export const EMOJI: readonly Emoji[] = [
  { emoji: "👍", shortcode: "thumbsup", keywords: ["+1", "like", "yes"] },
  { emoji: "👎", shortcode: "thumbsdown", keywords: ["-1", "dislike", "no"] },
  { emoji: "❤️", shortcode: "heart", keywords: ["love", "like", "red"] },
  { emoji: "😂", shortcode: "joy", keywords: ["laugh", "lol", "tears"] },
  { emoji: "😮", shortcode: "open_mouth", keywords: ["wow", "surprise"] },
  { emoji: "👏", shortcode: "clap", keywords: ["applause", "bravo"] },
  { emoji: "🎉", shortcode: "tada", keywords: ["party", "celebrate"] },
  { emoji: "😀", shortcode: "grinning", keywords: ["smile", "happy"] },
  { emoji: "😃", shortcode: "smiley", keywords: ["smile", "happy", "joy"] },
  { emoji: "😄", shortcode: "smile", keywords: ["happy", "joy", "laugh"] },
  { emoji: "😁", shortcode: "grin", keywords: ["smile", "teeth"] },
  { emoji: "😆", shortcode: "laughing", keywords: ["lol", "happy"] },
  { emoji: "😅", shortcode: "sweat_smile", keywords: ["relief", "phew"] },
  { emoji: "🤣", shortcode: "rofl", keywords: ["laugh", "lol", "floor"] },
  { emoji: "🙂", shortcode: "slightly_smiling_face", keywords: ["smile"] },
  { emoji: "🙃", shortcode: "upside_down_face", keywords: ["silly"] },
  { emoji: "😉", shortcode: "wink", keywords: ["flirt", "joke"] },
  { emoji: "😊", shortcode: "blush", keywords: ["smile", "shy", "happy"] },
  { emoji: "😇", shortcode: "innocent", keywords: ["angel", "halo"] },
  { emoji: "🥰", shortcode: "smiling_face_with_hearts", keywords: ["love"] },
  { emoji: "😍", shortcode: "heart_eyes", keywords: ["love", "crush"] },
  { emoji: "🤩", shortcode: "star_struck", keywords: ["wow", "amazing"] },
  { emoji: "😘", shortcode: "kissing_heart", keywords: ["kiss", "love"] },
  { emoji: "😋", shortcode: "yum", keywords: ["tasty", "delicious"] },
  { emoji: "😛", shortcode: "stuck_out_tongue", keywords: ["tongue"] },
  { emoji: "🤪", shortcode: "zany_face", keywords: ["crazy", "goofy"] },
  { emoji: "🤗", shortcode: "hugs", keywords: ["hug", "embrace"] },
  { emoji: "🤫", shortcode: "shushing_face", keywords: ["quiet", "shh"] },
  { emoji: "🤔", shortcode: "thinking", keywords: ["hmm", "think"] },
  { emoji: "🤨", shortcode: "raised_eyebrow", keywords: ["suspicious"] },
  { emoji: "😐", shortcode: "neutral_face", keywords: ["meh"] },
  { emoji: "😏", shortcode: "smirk", keywords: ["smug", "sly"] },
  { emoji: "😒", shortcode: "unamused", keywords: ["meh", "annoyed"] },
  { emoji: "🙄", shortcode: "roll_eyes", keywords: ["eyeroll", "whatever"] },
  { emoji: "😬", shortcode: "grimacing", keywords: ["awkward", "eek"] },
  { emoji: "😌", shortcode: "relieved", keywords: ["calm", "peace"] },
  { emoji: "😔", shortcode: "pensive", keywords: ["sad", "thoughtful"] },
  { emoji: "😴", shortcode: "sleeping", keywords: ["zzz", "tired"] },
  { emoji: "😷", shortcode: "mask", keywords: ["sick", "ill"] },
  { emoji: "🤯", shortcode: "exploding_head", keywords: ["mind_blown"] },
  { emoji: "🥳", shortcode: "partying_face", keywords: ["party", "birthday"] },
  { emoji: "😎", shortcode: "sunglasses", keywords: ["cool"] },
  { emoji: "🤓", shortcode: "nerd_face", keywords: ["geek", "glasses"] },
  { emoji: "😕", shortcode: "confused", keywords: ["unsure"] },
  { emoji: "😟", shortcode: "worried", keywords: ["nervous", "concern"] },
  { emoji: "😲", shortcode: "astonished", keywords: ["shocked", "wow"] },
  { emoji: "😳", shortcode: "flushed", keywords: ["embarrassed"] },
  { emoji: "🥺", shortcode: "pleading_face", keywords: ["please", "puppy"] },
  { emoji: "😢", shortcode: "cry", keywords: ["sad", "tear"] },
  { emoji: "😭", shortcode: "sob", keywords: ["cry", "sad", "tears"] },
  { emoji: "😱", shortcode: "scream", keywords: ["fear", "shocked"] },
  { emoji: "😤", shortcode: "triumph", keywords: ["huff", "proud"] },
  { emoji: "😡", shortcode: "rage", keywords: ["angry", "mad"] },
  { emoji: "😠", shortcode: "angry", keywords: ["mad", "annoyed"] },
  { emoji: "💀", shortcode: "skull", keywords: ["dead", "lol"] },
  { emoji: "💩", shortcode: "poop", keywords: ["poo", "crap"] },
  { emoji: "👻", shortcode: "ghost", keywords: ["boo", "halloween"] },
  { emoji: "🤖", shortcode: "robot", keywords: ["bot", "ai"] },
  { emoji: "👋", shortcode: "wave", keywords: ["hello", "hi", "bye"] },
  { emoji: "✋", shortcode: "raised_hand", keywords: ["high_five", "stop"] },
  { emoji: "👌", shortcode: "ok_hand", keywords: ["ok", "perfect"] },
  { emoji: "✌️", shortcode: "v", keywords: ["peace", "victory"] },
  { emoji: "🤞", shortcode: "crossed_fingers", keywords: ["luck", "hope"] },
  { emoji: "🤘", shortcode: "metal", keywords: ["rock", "horns"] },
  { emoji: "👈", shortcode: "point_left", keywords: ["left"] },
  { emoji: "👉", shortcode: "point_right", keywords: ["right"] },
  { emoji: "👆", shortcode: "point_up_2", keywords: ["up", "this"] },
  { emoji: "👇", shortcode: "point_down", keywords: ["down"] },
  { emoji: "✊", shortcode: "fist", keywords: ["power", "solidarity"] },
  { emoji: "👊", shortcode: "punch", keywords: ["fist_bump", "bro"] },
  { emoji: "🙌", shortcode: "raised_hands", keywords: ["hooray", "yay"] },
  { emoji: "🤝", shortcode: "handshake", keywords: ["deal", "agree"] },
  { emoji: "🙏", shortcode: "pray", keywords: ["please", "thanks"] },
  { emoji: "💪", shortcode: "muscle", keywords: ["strong", "flex"] },
  { emoji: "👀", shortcode: "eyes", keywords: ["look", "see", "watch"] },
  { emoji: "🧠", shortcode: "brain", keywords: ["smart", "think"] },
  { emoji: "🫡", shortcode: "saluting_face", keywords: ["salute", "yes"] },
  { emoji: "🫶", shortcode: "heart_hands", keywords: ["love", "thanks"] },
  { emoji: "💛", shortcode: "yellow_heart", keywords: ["love"] },
  { emoji: "💚", shortcode: "green_heart", keywords: ["love"] },
  { emoji: "💙", shortcode: "blue_heart", keywords: ["love"] },
  { emoji: "💜", shortcode: "purple_heart", keywords: ["love"] },
  { emoji: "💔", shortcode: "broken_heart", keywords: ["sad", "heartbreak"] },
  { emoji: "💕", shortcode: "two_hearts", keywords: ["love"] },
  { emoji: "💯", shortcode: "100", keywords: ["hundred", "perfect", "score"] },
  { emoji: "🔥", shortcode: "fire", keywords: ["lit", "hot", "flame"] },
  { emoji: "✨", shortcode: "sparkles", keywords: ["shiny", "new", "magic"] },
  { emoji: "⭐", shortcode: "star", keywords: ["favorite"] },
  { emoji: "⚡", shortcode: "zap", keywords: ["lightning", "fast"] },
  { emoji: "💥", shortcode: "boom", keywords: ["explode", "collision"] },
  { emoji: "💬", shortcode: "speech_balloon", keywords: ["comment", "chat"] },
  { emoji: "💡", shortcode: "bulb", keywords: ["idea", "light"] },
  { emoji: "🚀", shortcode: "rocket", keywords: ["ship", "launch"] },
  { emoji: "🎯", shortcode: "dart", keywords: ["target", "goal"] },
  { emoji: "🏆", shortcode: "trophy", keywords: ["win", "award"] },
  { emoji: "🎁", shortcode: "gift", keywords: ["present", "birthday"] },
  { emoji: "🎂", shortcode: "birthday", keywords: ["cake", "party"] },
  { emoji: "🍕", shortcode: "pizza", keywords: ["food"] },
  { emoji: "🍔", shortcode: "hamburger", keywords: ["burger", "food"] },
  { emoji: "🍿", shortcode: "popcorn", keywords: ["movie", "snack"] },
  { emoji: "🍪", shortcode: "cookie", keywords: ["sweet", "snack"] },
  { emoji: "☕", shortcode: "coffee", keywords: ["cafe", "espresso"] },
  { emoji: "🍺", shortcode: "beer", keywords: ["drink", "cheers"] },
  { emoji: "🥂", shortcode: "clinking_glasses", keywords: ["cheers"] },
  { emoji: "🐶", shortcode: "dog", keywords: ["puppy", "pet"] },
  { emoji: "🐱", shortcode: "cat", keywords: ["kitten", "pet"] },
  { emoji: "🦄", shortcode: "unicorn", keywords: ["magic"] },
  { emoji: "🐛", shortcode: "bug", keywords: ["insect", "issue"] },
  { emoji: "🙈", shortcode: "see_no_evil", keywords: ["monkey", "oops"] },
  { emoji: "🌈", shortcode: "rainbow", keywords: ["pride"] },
  { emoji: "☀️", shortcode: "sunny", keywords: ["sun", "weather"] },
  { emoji: "❄️", shortcode: "snowflake", keywords: ["cold", "winter"] },
  { emoji: "🌱", shortcode: "seedling", keywords: ["plant", "grow"] },
  { emoji: "✅", shortcode: "white_check_mark", keywords: ["done", "yes"] },
  { emoji: "❌", shortcode: "x", keywords: ["no", "cross", "wrong"] },
  { emoji: "⚠️", shortcode: "warning", keywords: ["caution", "alert"] },
  { emoji: "❓", shortcode: "question", keywords: ["what", "help"] },
  { emoji: "❗", shortcode: "exclamation", keywords: ["important"] },
  { emoji: "🚧", shortcode: "construction", keywords: ["wip", "work"] },
  { emoji: "🚨", shortcode: "rotating_light", keywords: ["alert", "siren"] },
  { emoji: "📌", shortcode: "pushpin", keywords: ["pin", "location"] },
  { emoji: "📅", shortcode: "date", keywords: ["calendar", "schedule"] },
  { emoji: "📝", shortcode: "memo", keywords: ["note", "write"] },
  { emoji: "📈", shortcode: "chart_with_upwards_trend", keywords: ["up"] },
  { emoji: "📉", shortcode: "chart_with_downwards_trend", keywords: ["down"] },
  { emoji: "💻", shortcode: "computer", keywords: ["laptop", "code"] },
  { emoji: "📱", shortcode: "iphone", keywords: ["phone", "mobile"] },
  { emoji: "🔒", shortcode: "lock", keywords: ["secure", "private"] },
  { emoji: "🔑", shortcode: "key", keywords: ["password", "access"] },
  { emoji: "🔗", shortcode: "link", keywords: ["url", "chain"] },
  { emoji: "🔔", shortcode: "bell", keywords: ["notification"] },
  { emoji: "📣", shortcode: "mega", keywords: ["announcement"] },
  { emoji: "🏠", shortcode: "house", keywords: ["home"] },
  { emoji: "✈️", shortcode: "airplane", keywords: ["travel", "flight"] },
  { emoji: "👑", shortcode: "crown", keywords: ["king", "queen"] },
  { emoji: "🎵", shortcode: "musical_note", keywords: ["music", "song"] },
  { emoji: "🎮", shortcode: "video_game", keywords: ["game", "play"] },
];

/**
 * Up to `limit` emoji for a query of at least two characters: shortcode
 * prefixes first, then keyword prefixes, then substrings of either.
 */
export function searchEmoji(
  query: string,
  emoji: readonly Emoji[] = EMOJI,
  limit = 8,
): ComposerItemValue[] {
  const text = query.trim().toLocaleLowerCase().replace(/\s+/g, "_");
  if (text.length < 2) return [];
  const ranked: Emoji[][] = [[], [], []];
  for (const item of emoji) {
    if (item.shortcode.startsWith(text)) ranked[0]?.push(item);
    else if (item.keywords.some((keyword) => keyword.startsWith(text)))
      ranked[1]?.push(item);
    else if (
      item.shortcode.includes(text) ||
      item.keywords.some((keyword) => keyword.includes(text))
    )
      ranked[2]?.push(item);
  }
  return ranked
    .flat()
    .slice(0, limit)
    .map((item) => ({
      id: item.shortcode,
      label: item.shortcode,
      text: item.emoji,
      type: "text" as const,
    }));
}
