window.DeckiMastaStrings = {
  en: {
    title: "DeckíMastá",
    subtitle: "Make vocabulary decks for mastering conversation.",
    langGroup: "Interface language",
    themeGroup: "Appearance",
    themeSystem: "Match system appearance",
    themeLight: "Light appearance",
    themeDark: "Dark appearance",
    connectTitle: "Connect WaniKani",
    tokenSavedCompact: "Token saved on this device.",
    manageToken: "Manage token",
    tokenHelp:
      "Your API token is stored only in this browser. It is never included in this project file.",
    tokenLabel: "WaniKani API token",
    tokenPlaceholder: "Paste your API token here",
    saveToken: "Save token",
    forgetToken: "Forget token",
    done: "Done",
    tokenFaqSummary: "Where do I get my token?",
    tokenFaqBody:
      "In WaniKani, open your account settings and find the API Tokens section. Create a token with read access. This app only needs read access to your assignments and subjects.",
    languagesTitle: "Step 1: Choose Languages",
    languagesIntro:
      "Tell us the language you already speak and the one you are learning. This pair decides which word sources you can use and how your practice prompt is written, so the two must be different.",
    nativeLanguage: "Native language",
    targetLanguage: "Target language",
    selectLanguage: "Select a language",
    langEnglish: "English",
    langJapanese: "Japanese",
    swapLanguages: "Swap native and target languages",
    languagesSameError: "Native and target languages must be different.",
    loadTitle: "Step 2: Build Your Deck",
    loadIntro:
      "Pick where your vocabulary comes from, then assemble a deck to practice.",
    dataSource: "Source",
    sourceHelpAria: "About this source",
    sourceHelpFallback: "Choose a data source to see what it provides.",
    sourceLabelWanikani: "WaniKani",
    sourceDescWanikani:
      "Your WaniKani vocabulary assignments. Uses your API token to load words you have started, with recency based on when you last studied them.",
    sourceLabelCsvPaste: "CSV Paste",
    sourceDescCsvPaste:
      "Paste your own word list as CSV-like rows. Works for any language pair; optional dates enable the Recency filter.",
    sourceLabelCsvFile: "CSV File",
    sourceDescCsvFile:
      "Upload a .csv or .txt word list in the same format as CSV Paste. Works for any language pair.",
    sourceLabelTop1000English: "Top 1000 English Words",
    sourceDescTop1000English:
      "A static list of the 1,000 most common English words with Japanese glosses. Built for Japanese speakers learning English. No API key; Recency does not apply.",
    sourceLabelJlptN5: "JLPT N5",
    sourceDescJlptN5:
      "A static JLPT N5 vocabulary list (Japanese words with English meanings). Built for English speakers learning Japanese. No API key; Recency does not apply.",
    lookBack: "Recency",
    lookBackHelpAria: "About Recency",
    lookBackHelp:
      "Only include words you last studied within this time window. Sources without study dates hide this option.",
    range24: "Last 24 hours",
    range48: "Last 2 days",
    range72: "Last 3 days",
    range168: "Last 7 days",
    range336: "Last 14 days",
    limitResults: "Limit",
    limitPlaceholder: "All",
    randomize: "Randomize",
    loadVocabulary: "Build deck",
    loadHelp:
      "Leave the limit blank to keep every match in the deck. Randomize shuffles before applying the limit.",
    loadHelpAria: "About Limit",
    noSourcesRegistered: "No data sources are registered.",
    noSourcesForLanguages:
      "No data sources support this native and target language pair.",
    csvFormatIntro: "Paste headerless CSV-like rows. Required columns:",
    csvFormatOptional: "Optional columns:",
    csvFormatRules:
      "Use | inside alternatives, meanings, and parts_of_speech. Dates may be YYYY-MM-DD or a full timestamp; blank dates default to now.",
    csvPartsOfSpeech: "Accepted parts of speech:",
    csvPasteLabel: "Word list",
    csvPastePlaceholder:
      "word,alternatives,meanings,created_at,last_seen_at,parts_of_speech",
    csvPasteEmpty: "Paste at least one CSV word row first.",
    csvFileIntro:
      "Upload a .csv or .txt file using the same format as CSV paste.",
    csvFileLabel: "CSV file",
    csvChooseFile: "Choose file",
    csvNoFileChosen: "No file chosen",
    csvFileEmpty: "Choose a CSV file to upload first.",
    recentlyLearned: "Step 3: Confirm Your Deck",
    wordsIntro:
      "This is your deck. Check that it looks right, then start practicing. You can practice with friends in person or create a conversation prompt for ChatGPT.",
    createPractice: "Practice this deck",
    copyWordList: "Copy deck",
    practiceTitle: "Step 4: Practice Your Deck",
    practiceIntro:
      "Choose how you want to practice this deck. The prompt will change based on your settings.",
    practiceMode: "Practice mode",
    modeSpeaking: "Speaking",
    modeListening: "Listening",
    cefrLevel: "Difficulty (CEFR)",
    cefrHelpAria: "About CEFR levels",
    cefrTooltip:
      "CEFR Scale (Global Standard)\n\nA1 (Beginner): Uses basic phrases and everyday expressions; can introduce themselves and ask simple questions.\n\nA2 (Elementary): Understands direct sentences on familiar, routine topics and immediate needs.\n\nB1 (Intermediate): Handles most travel or everyday situations; links simple sentences to describe experiences.\n\nB2 (Upper-Intermediate): Interacts with native speakers fluently and naturally; understands complex technical or abstract texts.\n\nC1 (Advanced): Expresses ideas smoothly and implicitly; uses the language effectively for social, academic, or professional work.\n\nC2 (Proficient): Understands everything with ease; fine-tunes shades of meaning precisely and spontaneously.",
    cefrA1: "A1 (Beginner)",
    cefrA2: "A2 (Elementary)",
    cefrB1: "B1 (Intermediate)",
    cefrB2: "B2 (Upper-Intermediate)",
    cefrC1: "C1 (Advanced)",
    cefrC2: "C2 (Proficient)",
    correctPronunciation: "Correct pronunciation",
    correctGrammar: "Correct grammar",
    difficultyRule:
      "Start at CEFR {cefrLevel}. {description} Adjust to my ability if this is too difficult or too easy.",
    cefrDescA1:
      "Use basic phrases and everyday expressions; keep exchanges simple enough for introductions and simple questions.",
    cefrDescA2:
      "Use direct sentences on familiar, routine topics and immediate needs.",
    cefrDescB1:
      "Handle everyday or travel-like situations, and link simple sentences to describe experiences.",
    cefrDescB2:
      "Interact fluently and naturally, including more complex or abstract topics when they come up.",
    cefrDescC1:
      "Express ideas smoothly and with nuance, suitable for social, academic, or professional conversation.",
    cefrDescC2:
      "Speak with near-native precision, including fine shades of meaning.",
    correctionBoth:
      "When I make a pronunciation or grammar mistake, briefly correct it and then continue the conversation.",
    correctionPronunciationOnly:
      "Correct my pronunciation briefly when needed, then continue. Do not correct my grammar unless I ask.",
    correctionGrammarOnly:
      "Correct my grammar briefly when needed, then continue. Do not correct my pronunciation unless I ask.",
    correctionNeither:
      "Do not correct my pronunciation or grammar unless I ask.",
    practiceHelpSpeaking:
      "Copy this into ChatGPT. The AI waits for your questions and can suggest starter words one at a time.",
    practiceHelpListening:
      "Copy this into ChatGPT. The AI uses the target words and asks you questions about them.",
    copyPrompt: "Copy prompt",
    openChatGPT: "Open ChatGPT",
    pasteTokenFirst: "Please paste your WaniKani API token first.",
    tokenSaved: "Token saved in this browser.",
    tokenForgotten: "Token forgotten.",
    tokenRejected:
      "WaniKani rejected the token. Check that it is correct and has read access.",
    apiError: "WaniKani API error ({status}).",
    enterTokenFirst: "Enter and save your WaniKani API token first.",
    loading: "Building your deck...",
    noVocabulary: "No words found for a deck in that time range.",
    foundWords: "Deck ready: {count} word.",
    foundWordsPlural: "Deck ready: {count} words.",
    foundWordsFiltered: "Deck ready: {count} words ({details}).",
    randomized: "randomized",
    showing: "showing {count}",
    wordCount: "{count} word",
    wordCountPlural: "{count} words",
    emptyWords: "Your deck is empty. Try a wider time range.",
    wordListCopied: "Deck copied.",
    promptCopied: "Prompt copied.",
    clipboardFailed:
      "Clipboard access failed. You can select and copy the text manually.",
    promptTemplateSpeaking: `I'm studying {targetLanguage} and I have this vocabulary deck:

{list}

Help me practice speaking with this deck in natural {targetLanguage} conversation.

Please follow these rules:
- Wait for me to ask questions about the words. Do not start by quizzing me.
- Answer my questions clearly and keep the conversation going one turn at a time.
- When I am ready to speak, or when I ask what to practice, introduce one target word at a time as a conversation starter and invite me to begin using it.
- After I use a suggested word, you may offer the next unused target word one by one.
- {difficultyRule}
- Prefer everyday situations rather than artificial example sentences.
- {correctionRule}
- Keep explanations concise unless I ask for more detail.
- Speak primarily in {targetLanguage}, using {nativeLanguage} only when necessary.
- Begin by briefly acknowledging the deck and inviting me to ask my first question.`,
    promptTemplateListening: `I'm studying {targetLanguage} and I have this vocabulary deck:

{list}

Help me practice listening comprehension with this deck.

Please follow these rules:
- Use the target words naturally in {targetLanguage} as you speak.
- Ask me questions about the words (meaning, usage, nuance, or context) so I demonstrate that I understand them.
- Have a real exchange with me, one turn at a time.
- {difficultyRule}
- Prefer everyday situations rather than artificial example sentences.
- Don't force a vocabulary word into every sentence. Let the conversation feel natural.
- {correctionRule}
- Keep explanations concise unless I ask for more detail.
- Speak primarily in {targetLanguage}, using {nativeLanguage} only when necessary.
- Start by asking me your first question about one of the words now.`,
  },
  ja: {
    title: "DeckíMastá",
    subtitle: "会話を極めるための語彙デッキを作りましょう。",
    langGroup: "表示言語",
    themeGroup: "外観",
    themeSystem: "システムの外観に合わせる",
    themeLight: "ライト外観",
    themeDark: "ダーク外観",
    connectTitle: "WaniKaniに接続",
    tokenSavedCompact: "トークンはこの端末に保存されています。",
    manageToken: "トークンを管理",
    tokenHelp:
      "APIトークンはこのブラウザにのみ保存されます。このプロジェクトファイルには含まれません。",
    tokenLabel: "WaniKani APIトークン",
    tokenPlaceholder: "APIトークンを貼り付けてください",
    saveToken: "トークンを保存",
    forgetToken: "トークンを削除",
    done: "完了",
    tokenFaqSummary: "トークンの取得方法は？",
    tokenFaqBody:
      "WaniKaniのアカウント設定を開き、API Tokensのセクションを見つけてください。読み取り権限のあるトークンを作成します。このアプリには課題と科目への読み取りアクセスだけが必要です。",
    languagesTitle: "ステップ1: 言語を選ぶ",
    languagesIntro:
      "あなたがすでに話せる言語と、これから学ぶ言語を選んでください。この組み合わせで、使えるデータソースと練習プロンプトの書かれ方が決まります。同じ言語は選べません。",
    nativeLanguage: "母語",
    targetLanguage: "学習言語",
    selectLanguage: "言語を選択",
    langEnglish: "英語",
    langJapanese: "日本語",
    swapLanguages: "母語と学習言語を入れ替える",
    languagesSameError: "母語と学習言語は別の言語にしてください。",
    loadTitle: "ステップ2: デッキを作る",
    loadIntro: "単語の取り込み元を選び、練習用のデッキを組み立てます。",
    dataSource: "ソース",
    sourceHelpAria: "このソースについて",
    sourceHelpFallback: "データソースを選ぶと、内容の説明が表示されます。",
    sourceLabelWanikani: "WaniKani",
    sourceDescWanikani:
      "WaniKaniの語彙課題です。APIトークンで学習開始済みの単語を読み込み、直近の学習時期で絞り込めます。",
    sourceLabelCsvPaste: "CSV貼り付け",
    sourceDescCsvPaste:
      "CSV風の行として自分の単語リストを貼り付けます。どの言語ペアでも使え、日付があれば直近フィルタが効きます。",
    sourceLabelCsvFile: "CSVファイル",
    sourceDescCsvFile:
      "CSV貼り付けと同じ形式の .csv / .txt をアップロードします。どの言語ペアでも使えます。",
    sourceLabelTop1000English: "英語頻出1000語リスト",
    sourceDescTop1000English:
      "英語の頻出単語1000語と日本語訳の静的リストです。日本語話者が英語を学ぶ方向け。APIキー不要で、直近フィルタは使いません。",
    sourceLabelJlptN5: "JLPT N5",
    sourceDescJlptN5:
      "JLPT N5語彙の静的リスト（日本語の語と英語の意味）です。英語話者が日本語を学ぶ方向け。APIキー不要で、直近フィルタは使いません。",
    lookBack: "直近",
    lookBackHelpAria: "直近について",
    lookBackHelp:
      "この期間内に最後に学習した単語だけを含めます。学習日がないソースでは、この項目は表示されません。",
    range24: "過去24時間",
    range48: "過去2日間",
    range72: "過去3日間",
    range168: "過去7日間",
    range336: "過去14日間",
    limitResults: "件数",
    limitPlaceholder: "すべて",
    randomize: "ランダム",
    loadVocabulary: "デッキを作る",
    loadHelp:
      "件数を空欄にすると、該当するすべてをデッキに含めます。ランダムをオンにすると、制限を適用する前にシャッフルします。",
    loadHelpAria: "件数について",
    noSourcesRegistered: "登録されたデータソースがありません。",
    noSourcesForLanguages:
      "この母語と学習言語の組み合わせに対応するデータソースはありません。",
    csvFormatIntro: "ヘッダーなしのCSV風の行を貼り付けてください。必須列：",
    csvFormatOptional: "任意列：",
    csvFormatRules:
      "alternatives・meanings・parts_of_speech は | 区切りです。日付は YYYY-MM-DD またはタイムスタンプ。空欄の日付は現在時刻になります。",
    csvPartsOfSpeech: "対応する品詞：",
    csvPasteLabel: "単語リスト",
    csvPastePlaceholder:
      "word,alternatives,meanings,created_at,last_seen_at,parts_of_speech",
    csvPasteEmpty: "先にCSVの単語行を貼り付けてください。",
    csvFileIntro:
      "CSV pasteと同じ形式の .csv または .txt ファイルをアップロードします。",
    csvFileLabel: "CSVファイル",
    csvChooseFile: "ファイルを選択",
    csvNoFileChosen: "選択されていません",
    csvFileEmpty: "先にCSVファイルを選んでください。",
    recentlyLearned: "ステップ3: デッキを確認",
    wordsIntro:
      "これがあなたのデッキです。内容を確認して、問題なければ練習を始めましょう。友達と実際に話したり、ChatGPTに会話プロンプトを作成して練習したりできます。",
    createPractice: "このデッキで練習",
    copyWordList: "デッキをコピー",
    practiceTitle: "ステップ4: デッキを練習",
    practiceIntro:
      "このデッキの練習のしかたを選んでください。プロンプトは設定を変えるたびに書き換わります。",
    practiceMode: "練習モード",
    modeSpeaking: "スピーキング",
    modeListening: "リスニング",
    cefrLevel: "難易度（CEFR）",
    cefrHelpAria: "CEFRレベルについて",
    cefrTooltip:
      "CEFRスケール（国際標準）\n\nA1（初級）：基本的な言い回しや日常表現が使え、自己紹介や簡単な質問ができる。\n\nA2（初級上）：慣れ親しんだ日常的な話題や当面の用件について、直接的な文が理解できる。\n\nB1（中級）：旅行や日常のほとんどの場面に対応でき、経験を簡単な文をつなげて説明できる。\n\nB2（中級上）：ネイティブと流暢かつ自然にやり取りでき、複雑・抽象的な内容も理解できる。\n\nC1（上級）：考えを滑らかに・含みをもって表現でき、社会・学術・仕事で効果的に使える。\n\nC2（熟達）：ほぼすべてを楽に理解し、意味の微妙な違いを正確かつ即座に使い分けられる。",
    cefrA1: "A1（初級）",
    cefrA2: "A2（初級上）",
    cefrB1: "B1（中級）",
    cefrB2: "B2（中級上）",
    cefrC1: "C1（上級）",
    cefrC2: "C2（熟達）",
    correctPronunciation: "発音を訂正する",
    correctGrammar: "文法を訂正する",
    difficultyRule:
      "CEFR {cefrLevel}から始めてください。{description} 難しすぎる、または簡単すぎる場合は私の実力に合わせて調整してください。",
    cefrDescA1:
      "基本的な言い回しと日常表現を使い、自己紹介や簡単な質問ができる程度のやりとりにしてください。",
    cefrDescA2:
      "慣れ親しんだ日常的な話題や当面の用件について、直接的な文を使ってください。",
    cefrDescB1:
      "日常や旅行のような場面に対応し、経験を簡単な文をつなげて説明できる程度にしてください。",
    cefrDescB2:
      "流暢で自然なやり取りにし、必要ならより複雑・抽象的な話題も含めてください。",
    cefrDescC1:
      "考えを滑らかに・ニュアンス付きで表現し、社会・学術・仕事の会話にも適したレベルにしてください。",
    cefrDescC2:
      "ほぼネイティブ並みの精度で話し、意味の微妙な違いも扱えるようにしてください。",
    correctionBoth:
      "発音や文法を間違えたら簡潔に訂正し、そのまま会話を続けてください。",
    correctionPronunciationOnly:
      "発音の誤りは簡潔に訂正してから続けてください。文法は求めない限り訂正しないでください。",
    correctionGrammarOnly:
      "文法の誤りは簡潔に訂正してから続けてください。発音は求めない限り訂正しないでください。",
    correctionNeither: "求めない限り、発音も文法も訂正しないでください。",
    practiceHelpSpeaking:
      "これをChatGPTに貼り付けてください。AIはあなたの質問を待ち、練習する単語を一つずつ提案できます。",
    practiceHelpListening:
      "これをChatGPTに貼り付けてください。AIが目標の単語を使い、その単語についての質問をします。",
    copyPrompt: "プロンプトをコピー",
    openChatGPT: "ChatGPTを開く",
    pasteTokenFirst: "先にWaniKani APIトークンを貼り付けてください。",
    tokenSaved: "トークンをこのブラウザに保存しました。",
    tokenForgotten: "トークンを削除しました。",
    tokenRejected:
      "WaniKaniがトークンを拒否しました。正しいトークンか、読み取り権限があるか確認してください。",
    apiError: "WaniKani APIエラー（{status}）。",
    enterTokenFirst: "先にWaniKani APIトークンを入力して保存してください。",
    loading: "デッキを作成中…",
    noVocabulary: "その期間にデッキ用の単語が見つかりませんでした。",
    foundWords: "{count}語のデッキができました。",
    foundWordsPlural: "{count}語のデッキができました。",
    foundWordsFiltered: "{count}語のデッキができました（{details}）。",
    randomized: "ランダム化済み",
    showing: "{count}件を表示",
    wordCount: "{count}語",
    wordCountPlural: "{count}語",
    emptyWords: "デッキは空です。期間を広げてみてください。",
    wordListCopied: "デッキをコピーしました。",
    promptCopied: "プロンプトをコピーしました。",
    clipboardFailed:
      "クリップボードへのアクセスに失敗しました。手動で選択してコピーしてください。",
    promptTemplateSpeaking: `{targetLanguage}を勉強していて、次の語彙デッキがあります：

{list}

このデッキについて、自然な{targetLanguage}の会話でスピーキング練習できるよう手伝ってください。

次のルールに従ってください：
- 私が単語について質問するのを待ってください。いきなりクイズを始めないでください。
- 質問には分かりやすく答え、一度に一往復ずつ会話を続けてください。
- 私が話し始める準備ができたとき、または何を練習するか聞かれたときは、目標の単語を一つずつ会話のきっかけとして提示し、それを使って話し始めるよう促してください。
- 提案した単語を使ったあとは、まだ使っていない目標の単語を一つずつ次に提案して構いません。
- {difficultyRule}
- 作り物の例文より、日常的な場面を優先してください。
- {correctionRule}
- 詳しい説明を求めない限り、説明は簡潔にしてください。
- 主に{targetLanguage}で話し、必要なときだけ{nativeLanguage}を使ってください。
- まずデッキを短く確認し、最初の質問をするよう促して始めてください。`,
    promptTemplateListening: `{targetLanguage}を勉強していて、次の語彙デッキがあります：

{list}

このデッキでリスニング理解の練習ができるよう手伝ってください。

次のルールに従ってください：
- 話すとき、目標の単語を自然な{targetLanguage}の中で使ってください。
- 単語の意味・使い方・ニュアンス・文脈などについて質問し、理解できているか確認してください。
- 一度に一往復ずつ、実際のやり取りをしてください。
- {difficultyRule}
- 作り物の例文より、日常的な場面を優先してください。
- すべての文に無理に単語を入れないでください。会話が自然に感じられるようにしてください。
- {correctionRule}
- 詳しい説明を求めない限り、説明は簡潔にしてください。
- 主に{targetLanguage}で話し、必要なときだけ{nativeLanguage}を使ってください。
- 今すぐ、単語の一つについての最初の質問をして始めてください。`,
  },
};
