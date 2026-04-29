// emotions.js — emotion data mapped from face-api's 7 outputs to the wheel

export const EMOTIONS = {
  happy: {
    jp: '喜び',
    en: 'Joy',
    cluster: 'JOY',
    colors: { bg: '#f7e8c0', acc: '#b5651d', mid: '#e8c97a' },
    facialCues: [
      'Corners of the mouth pulled upward (zygomatic major muscle)',
      'Cheeks raised, creating slight squinting of the eyes',
      'Crow\'s feet wrinkles appear at the outer eye corners',
      'Nasolabial folds deepen from nose to mouth corners',
    ],
    states: ['Contentment', 'Happiness', 'Elation', 'Ecstasy'],
    subEmotions: [
      { name: 'Contentment', jp: '満足', desc: 'A quiet, settled sense that things are as they should be. Low intensity, long-lasting.' },
      { name: 'Happiness', jp: '幸福', desc: 'Active pleasure and positive engagement with the world around you.' },
      { name: 'Elation', jp: '高揚', desc: 'Intense joy with a sense of energy and uplift — often triggered by unexpected good news.' },
      { name: 'Ecstasy', jp: '恍惚', desc: 'The peak of joy. Overwhelming, almost uncontainable positive feeling.' },
    ],
    description: 'Joy arises when things go the way we want or when we connect with others. It ranges from quiet contentment to overwhelming elation.',
    action: 'Approach, engage, share. Joy motivates prosocial behavior and strengthens bonds.',
  },

  sad: {
    jp: '悲しみ',
    en: 'Sadness',
    cluster: 'SADNESS',
    colors: { bg: '#c9d8e8', acc: '#2c4a6e', mid: '#8aaac8' },
    facialCues: [
      'Inner corners of eyebrows raised and drawn together',
      'Upper eyelids droop, eyes appear heavy or glassy',
      'Corners of the mouth pulled downward',
      'Lower lip may tremble or protrude slightly',
    ],
    states: ['Disappointment', 'Discouragement', 'Distraught', 'Grief'],
    subEmotions: [
      { name: 'Disappointment', jp: '失望', desc: 'The gap between what was expected and what happened. Mild and common.' },
      { name: 'Discouragement', jp: '落胆', desc: 'A loss of confidence or motivation, often after repeated setbacks.' },
      { name: 'Distraught', jp: '取り乱し', desc: 'Deeply upset, struggling to think clearly or function normally.' },
      { name: 'Grief', jp: '悲嘆', desc: 'The deepest sadness — a response to significant loss. Takes time and cannot be rushed.' },
    ],
    description: 'Sadness follows loss — of a person, a goal, or a sense of self. It slows us down and signals a need for comfort and reflection.',
    action: 'Withdraw, reflect, seek support. Sadness invites inward processing and connection.',
  },

  angry: {
    jp: '怒り',
    en: 'Anger',
    cluster: 'ANGER',
    colors: { bg: '#f2c4b0', acc: '#8b1a1a', mid: '#e08060' },
    facialCues: [
      'Brows pulled down and together, creating a furrowed forehead',
      'Upper eyelids raised, lower lids tensed — a hard, fixed stare',
      'Lips pressed firmly together or pulled back to expose teeth',
      'Jaw clenched, nostrils may flare',
    ],
    states: ['Annoyance', 'Frustration', 'Exasperation', 'Rage'],
    subEmotions: [
      { name: 'Annoyance', jp: '苛立ち', desc: 'Mild irritation from minor obstacles or repeated interruptions.' },
      { name: 'Frustration', jp: '欲求不満', desc: 'Blocked from a goal. The feeling of effort without result.' },
      { name: 'Exasperation', jp: '激怒', desc: 'Intense frustration, often from feeling unheard or repeatedly let down.' },
      { name: 'Rage', jp: '激情', desc: 'The peak of anger — a loss of control, overwhelming and potentially destructive.' },
    ],
    description: 'Anger is triggered by perceived injustice, obstruction, or threat. It energizes and prepares us to confront or remove the obstacle.',
    action: 'Confront, assert, or withdraw. Constructive anger drives change; destructive anger causes harm.',
  },

  fearful: {
    jp: '恐れ',
    en: 'Fear',
    cluster: 'FEAR',
    colors: { bg: '#d4c8e0', acc: '#3d1f6e', mid: '#9b7ec8' },
    facialCues: [
      'Eyebrows raised and pulled together, creating horizontal forehead lines',
      'Upper eyelids raised wide, showing more white of the eye',
      'Lower eyelids tensed upward',
      'Lips stretched horizontally back toward the ears',
    ],
    states: ['Trepidation', 'Nervousness', 'Anxiety', 'Terror'],
    subEmotions: [
      { name: 'Trepidation', jp: '不安感', desc: 'A low-level unease about something uncertain ahead.' },
      { name: 'Nervousness', jp: '緊張', desc: 'Heightened alertness before a challenging or unknown situation.' },
      { name: 'Anxiety', jp: '不安', desc: 'Persistent worry about future threats, real or imagined.' },
      { name: 'Terror', jp: '恐怖', desc: 'Extreme, overwhelming fear — the body\'s full alarm response activated.' },
    ],
    description: 'Fear is a response to perceived danger or threat. It sharpens attention and prepares the body to flee, freeze, or fight.',
    action: 'Flee, freeze, or fight. Fear is protective when calibrated — overwhelming when unchecked.',
  },

  disgusted: {
    jp: '嫌悪',
    en: 'Disgust',
    cluster: 'DISGUST',
    colors: { bg: '#c8dbc0', acc: '#2d5a27', mid: '#7ab870' },
    facialCues: [
      'Upper lip raised, often asymmetrically on one side',
      'Nose wrinkled, bridge creased',
      'Cheeks raised, eyes narrowed as if to block out the stimulus',
      'Lower lip may be pushed up or turned down',
    ],
    states: ['Dislike', 'Aversion', 'Revulsion', 'Loathing'],
    subEmotions: [
      { name: 'Dislike', jp: '嫌い', desc: 'A mild preference against something. Everyday and low-intensity.' },
      { name: 'Aversion', jp: '嫌悪感', desc: 'A stronger pull away from something perceived as unpleasant or wrong.' },
      { name: 'Revulsion', jp: '反感', desc: 'A visceral, physical reaction of rejection — the body wants to expel or escape.' },
      { name: 'Loathing', jp: '憎悪', desc: 'Deep, sustained disgust often mixed with contempt. The most intense form.' },
    ],
    description: 'Disgust evolved to protect us from contamination. It now extends to moral violations and social transgressions.',
    action: 'Reject, avoid, expel. Disgust creates strong boundaries between self and the unwanted.',
  },

  surprised: {
    jp: '驚き',
    en: 'Surprise',
    cluster: 'SURPRISE',
    colors: { bg: '#fde8d0', acc: '#c06000', mid: '#f0b060' },
    facialCues: [
      'Eyebrows raised high and curved, forehead wrinkled horizontally',
      'Upper eyelids raised, eyes opened wide',
      'Jaw drops open, lips part — mouth opens involuntarily',
      'Expression is brief — quickly replaced by another emotion',
    ],
    states: ['Startled', 'Confused', 'Amazed', 'Astonished'],
    subEmotions: [
      { name: 'Startled', jp: '驚愕', desc: 'An involuntary reflex to a sudden stimulus. Over in less than a second.' },
      { name: 'Confused', jp: '困惑', desc: 'Surprise mixed with uncertainty — the brain trying to make sense of something unexpected.' },
      { name: 'Amazed', jp: '感嘆', desc: 'Positive surprise at something impressive or wonderful.' },
      { name: 'Astonished', jp: '仰天', desc: 'Intense amazement — the unexpected is so significant it temporarily overrides everything else.' },
    ],
    description: 'Surprise is a brief, neutral response to the unexpected. It quickly gives way to another emotion depending on whether the event is good or bad.',
    action: 'Pause, orient, assess. Surprise resets attention so we can respond to what just changed.',
  },

  neutral: {
    jp: '平静',
    en: 'Calm',
    cluster: 'CALM',
    colors: { bg: '#e8e4de', acc: '#3a3530', mid: '#b0a898' },
    facialCues: [
      'Facial muscles are relaxed — no tension in brow, jaw, or lips',
      'Eyes are open at a natural, resting width',
      'Mouth is closed or slightly open, corners neither raised nor lowered',
      'Overall symmetry and stillness in the face',
    ],
    states: ['Neutral', 'Composed', 'Serene', 'Equanimous'],
    subEmotions: [
      { name: 'Neutral', jp: '中立', desc: 'No strong emotion present. A baseline, resting state.' },
      { name: 'Composed', jp: '落ち着き', desc: 'Actively settled — aware of surroundings, not reactive.' },
      { name: 'Serene', jp: '穏やか', desc: 'A gentle, peaceful calm. Comfortable and unhurried.' },
      { name: 'Equanimous', jp: '平静心', desc: 'Deep, stable calm even in the face of difficulty. The goal of the Atlas of Emotions.' },
    ],
    description: 'Calm is not the absence of emotion — it is an active state of balance. The Atlas of Emotions places calm as the goal: aware, present, and steady.',
    action: 'Observe, respond thoughtfully. Calm allows clear perception and deliberate choice.',
  },
};

export const FACEAPI_MAP = {
  happy:     'happy',
  sad:       'sad',
  angry:     'angry',
  fearful:   'fearful',
  disgusted: 'disgusted',
  surprised: 'surprised',
  neutral:   'neutral',
};
