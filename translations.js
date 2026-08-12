window.KaniKaiStrings = {
  en: {
    title: "KaniKai",
    subtitle: "Turn recently learned vocabulary into words you actually use.",
    langGroup: "Language",
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
    loadTitle: "Get recently learned words",
    dataSource: "Data source",
    lookBack: "Look back",
    range24: "Last 24 hours",
    range48: "Last 2 days",
    range72: "Last 3 days",
    range168: "Last 7 days",
    range336: "Last 14 days",
    limitResults: "Limit results",
    limitPlaceholder: "All",
    randomize: "Randomize",
    loadVocabulary: "Load vocabulary",
    loadHelp:
      "Leave the limit blank to keep every match. Randomize shuffles before applying the limit.",
    noSourcesRegistered: "No data sources are registered.",
    csvFormatIntro: "Paste headerless CSV-like rows. Required columns:",
    csvFormatOptional: "Optional columns:",
    csvFormatRules:
      "Use | inside alternatives, meanings, and parts_of_speech. Dates may be YYYY-MM-DD or a full timestamp; blank dates default to now.",
    csvPasteLabel: "Word list",
    csvPastePlaceholder: "本,ほん|ホン,book|volume,2026-08-10,2026-08-10,noun",
    csvPasteEmpty: "Paste at least one CSV word row first.",
    csvFileIntro:
      "Upload a .csv or .txt file using the same format as CSV paste.",
    csvFileLabel: "CSV file",
    csvChooseFile: "Choose file",
    csvNoFileChosen: "No file chosen",
    csvFileEmpty: "Choose a CSV file to upload first.",
    recentlyLearned: "Recently learned",
    createPractice: "Create conversation practice",
    copyWordList: "Copy word list",
    practiceTitle: "Conversation practice prompt",
    practiceMode: "Practice mode",
    modeSpeaking: "Speaking",
    modeListening: "Listening",
    modeLegacy: "Legacy",
    practiceHelpSpeaking:
      "Copy this into ChatGPT. The AI waits for your questions and can suggest starter words one at a time.",
    practiceHelpListening:
      "Copy this into ChatGPT. The AI uses the target words and asks you questions about them.",
    practiceHelpLegacy:
      "Copy this into ChatGPT and start talking. The prompt deliberately asks for one question at a time.",
    copyPrompt: "Copy prompt",
    openChatGPT: "Open ChatGPT",
    pasteTokenFirst: "Please paste your WaniKani API token first.",
    tokenSaved: "Token saved in this browser.",
    tokenForgotten: "Token forgotten.",
    tokenRejected:
      "WaniKani rejected the token. Check that it is correct and has read access.",
    apiError: "WaniKani API error ({status}).",
    enterTokenFirst: "Enter and save your WaniKani API token first.",
    loading: "Loading your recent lessons…",
    noVocabulary: "No vocabulary lessons found in that time range.",
    foundWords: "Found {count} vocabulary word.",
    foundWordsPlural: "Found {count} vocabulary words.",
    foundWordsFiltered: "Found {count} vocabulary words ({details}).",
    randomized: "randomized",
    showing: "showing {count}",
    wordCount: "{count} word",
    wordCountPlural: "{count} words",
    emptyWords: "Nothing here yet. Try a wider time range.",
    wordListCopied: "Word list copied.",
    promptCopied: "Prompt copied.",
    clipboardFailed:
      "Clipboard access failed. You can select and copy the text manually.",
    promptTemplateSpeaking: `I'm studying Japanese and I just learned these vocabulary words:

{list}

Help me practice speaking about these words in natural Japanese conversation.

Please follow these rules:
- Wait for me to ask questions about the words. Do not start by quizzing me.
- Answer my questions clearly and keep the conversation going one turn at a time.
- When I am ready to speak, or when I ask what to practice, introduce one target word at a time as a conversation starter and invite me to begin using it.
- After I use a suggested word, you may offer the next unused target word one by one.
- Start at an advanced-beginner/intermediate level, but adjust to my ability.
- Prefer everyday situations rather than artificial example sentences.
- When I make a mistake, briefly correct it and then continue the conversation.
- Keep explanations concise unless I ask for more detail.
- Speak primarily in Japanese, using English only when necessary.
- Begin by briefly acknowledging the word list and inviting me to ask my first question.`,
    promptTemplateListening: `I'm studying Japanese and I just learned these vocabulary words:

{list}

Help me practice listening comprehension with these words.

Please follow these rules:
- Use the target words naturally in Japanese as you speak.
- Ask me questions about the words (meaning, usage, nuance, or context) so I demonstrate that I understand them.
- Have a real exchange with me, one turn at a time.
- Start at an advanced-beginner/intermediate level, but adjust to my ability.
- Prefer everyday situations rather than artificial example sentences.
- Don't force a vocabulary word into every sentence. Let the conversation feel natural.
- When I make a mistake, briefly correct it and then continue.
- Keep explanations concise unless I ask for more detail.
- Speak primarily in Japanese, using English only when necessary.
- Start by asking me your first question about one of the words now.`,
    promptTemplateLegacy: `I'm studying Japanese and I just learned these vocabulary words:

{list}

Help me actively use these words in natural Japanese conversation.

Please follow these rules:
- Have a real conversation with me, one turn at a time.
- Ask me questions that naturally encourage me to use the vocabulary above.
- Start at an advanced-beginner/intermediate level, but adjust to my ability.
- Prefer everyday situations rather than artificial example sentences.
- Don't force a vocabulary word into every question. Let the conversation feel natural.
- When I make a mistake, briefly correct it and then continue the conversation.
- If I use one of the target words correctly, keep the conversation going rather than stopping to praise me.
- Occasionally challenge me to use a specific target word if I haven't used it yet.
- Keep explanations concise unless I ask for more detail.
- Speak primarily in Japanese, using English only when necessary.
- Start by asking me your first question now.`,
  },
  ja: {
    title: "カニ会",
    subtitle: "最近覚えた単語を、実際に使える言葉に変えましょう。",
    langGroup: "言語",
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
    loadTitle: "最近覚えた単語を取得",
    dataSource: "データソース",
    lookBack: "期間",
    range24: "過去24時間",
    range48: "過去2日間",
    range72: "過去3日間",
    range168: "過去7日間",
    range336: "過去14日間",
    limitResults: "件数制限",
    limitPlaceholder: "すべて",
    randomize: "ランダム",
    loadVocabulary: "単語を読み込む",
    loadHelp:
      "件数制限を空欄にすると、該当するすべてを表示します。ランダムをオンにすると、制限を適用する前にシャッフルします。",
    noSourcesRegistered: "登録されたデータソースがありません。",
    csvFormatIntro: "ヘッダーなしのCSV風の行を貼り付けてください。必須列：",
    csvFormatOptional: "任意列：",
    csvFormatRules:
      "alternatives・meanings・parts_of_speech は | 区切りです。日付は YYYY-MM-DD またはタイムスタンプ。空欄の日付は現在時刻になります。",
    csvPasteLabel: "単語リスト",
    csvPastePlaceholder: "本,ほん|ホン,book|volume,2026-08-10,2026-08-10,noun",
    csvPasteEmpty: "先にCSVの単語行を貼り付けてください。",
    csvFileIntro:
      "CSV pasteと同じ形式の .csv または .txt ファイルをアップロードします。",
    csvFileLabel: "CSVファイル",
    csvChooseFile: "ファイルを選択",
    csvNoFileChosen: "選択されていません",
    csvFileEmpty: "先にCSVファイルを選んでください。",
    recentlyLearned: "最近覚えた単語",
    createPractice: "会話練習を作成",
    copyWordList: "単語リストをコピー",
    practiceTitle: "会話練習プロンプト",
    practiceMode: "練習モード",
    modeSpeaking: "スピーキング",
    modeListening: "リスニング",
    modeLegacy: "レガシー",
    practiceHelpSpeaking:
      "これをChatGPTに貼り付けてください。AIはあなたの質問を待ち、練習する単語を一つずつ提案できます。",
    practiceHelpListening:
      "これをChatGPTに貼り付けてください。AIが目標の単語を使い、その単語についての質問をします。",
    practiceHelpLegacy:
      "これをChatGPTに貼り付けて会話を始めましょう。プロンプトは一度に一つの質問をするよう指示しています。",
    copyPrompt: "プロンプトをコピー",
    openChatGPT: "ChatGPTを開く",
    pasteTokenFirst: "先にWaniKani APIトークンを貼り付けてください。",
    tokenSaved: "トークンをこのブラウザに保存しました。",
    tokenForgotten: "トークンを削除しました。",
    tokenRejected:
      "WaniKaniがトークンを拒否しました。正しいトークンか、読み取り権限があるか確認してください。",
    apiError: "WaniKani APIエラー（{status}）。",
    enterTokenFirst: "先にWaniKani APIトークンを入力して保存してください。",
    loading: "最近のレッスンを読み込み中…",
    noVocabulary: "その期間に該当する単語のレッスンが見つかりませんでした。",
    foundWords: "{count}語の単語が見つかりました。",
    foundWordsPlural: "{count}語の単語が見つかりました。",
    foundWordsFiltered: "{count}語の単語が見つかりました（{details}）。",
    randomized: "ランダム化済み",
    showing: "{count}件を表示",
    wordCount: "{count}語",
    wordCountPlural: "{count}語",
    emptyWords: "まだ何もありません。期間を広げてみてください。",
    wordListCopied: "単語リストをコピーしました。",
    promptCopied: "プロンプトをコピーしました。",
    clipboardFailed:
      "クリップボードへのアクセスに失敗しました。手動で選択してコピーしてください。",
    promptTemplateSpeaking: `日本語を勉強していて、次の単語を覚えたところです：

{list}

これらの単語について、自然な日本語の会話でスピーキング練習できるよう手伝ってください。

次のルールに従ってください：
- 私が単語について質問するのを待ってください。いきなりクイズを始めないでください。
- 質問には分かりやすく答え、一度に一往復ずつ会話を続けてください。
- 私が話し始める準備ができたとき、または何を練習するか聞かれたときは、目標の単語を一つずつ会話のきっかけとして提示し、それを使って話し始めるよう促してください。
- 提案した単語を使ったあとは、まだ使っていない目標の単語を一つずつ次に提案して構いません。
- 初級後半〜中級レベルから始め、私の実力に合わせて調整してください。
- 作り物の例文より、日常的な場面を優先してください。
- 間違えたら簡潔に訂正し、そのまま会話を続けてください。
- 詳しい説明を求めない限り、説明は簡潔にしてください。
- 主に日本語で話し、必要なときだけ英語を使ってください。
- まず単語リストを短く確認し、最初の質問をするよう促して始めてください。`,
    promptTemplateListening: `日本語を勉強していて、次の単語を覚えたところです：

{list}

これらの単語でリスニング理解の練習ができるよう手伝ってください。

次のルールに従ってください：
- 話すとき、目標の単語を自然な日本語の中で使ってください。
- 単語の意味・使い方・ニュアンス・文脈などについて質問し、理解できているか確認してください。
- 一度に一往復ずつ、実際のやり取りをしてください。
- 初級後半〜中級レベルから始め、私の実力に合わせて調整してください。
- 作り物の例文より、日常的な場面を優先してください。
- すべての文に無理に単語を入れないでください。会話が自然に感じられるようにしてください。
- 間違えたら簡潔に訂正し、そのまま続けてください。
- 詳しい説明を求めない限り、説明は簡潔にしてください。
- 主に日本語で話し、必要なときだけ英語を使ってください。
- 今すぐ、単語の一つについての最初の質問をして始めてください。`,
    promptTemplateLegacy: `日本語を勉強していて、次の単語を覚えたところです：

{list}

これらの単語を自然な日本語の会話の中で積極的に使えるよう手伝ってください。

次のルールに従ってください：
- 一度に一往復ずつ、実際の会話をしてください。
- 上記の単語を自然に使いたくなるような質問をしてください。
- 初級後半〜中級レベルから始め、私の実力に合わせて調整してください。
- 作り物の例文より、日常的な場面を優先してください。
- すべての質問に無理に単語を入れないでください。会話が自然に感じられるようにしてください。
- 間違えたら簡潔に訂正し、そのまま会話を続けてください。
- 目標の単語を正しく使えたら、褒めて止まらずに会話を続けてください。
- まだ使っていない目標の単語があれば、ときどきそれを使うよう促してください。
- 詳しい説明を求めない限り、説明は簡潔にしてください。
- 主に日本語で話し、必要なときだけ英語を使ってください。
- 今すぐ最初の質問をして始めてください。`,
  },
};
