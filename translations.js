window.KaniKaiStrings = {
  en: {
    title: "KaniKai",
    subtitle: "Turn recently learned WaniKani vocabulary into words you actually use.",
    langGroup: "Language",
    connectTitle: "1. Connect WaniKani",
    tokenSavedCompact: "Token saved on this device.",
    manageToken: "Manage token",
    tokenHelp: "Your API token is stored only in this browser. It is never included in this project file.",
    tokenLabel: "WaniKani API token",
    tokenPlaceholder: "Paste your API token here",
    saveToken: "Save token",
    forgetToken: "Forget token",
    done: "Done",
    tokenFaqSummary: "Where do I get my token?",
    tokenFaqBody: "In WaniKani, open your account settings and find the API Tokens section. Create a token with read access. This app only needs read access to your assignments and subjects.",
    loadTitle: "2. Get recently learned words",
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
    loadHelp: "Leave the limit blank to keep every match. Randomize shuffles before applying the limit.",
    recentlyLearned: "Recently learned",
    createPractice: "Create conversation practice",
    copyWordList: "Copy word list",
    practiceTitle: "Conversation practice prompt",
    practiceHelp: "Copy this into ChatGPT and start talking. The prompt deliberately asks for one question at a time.",
    copyPrompt: "Copy prompt",
    openChatGPT: "Open ChatGPT",
    pasteTokenFirst: "Please paste your WaniKani API token first.",
    tokenSaved: "Token saved in this browser.",
    tokenForgotten: "Token forgotten.",
    tokenRejected: "WaniKani rejected the token. Check that it is correct and has read access.",
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
    clipboardFailed: "Clipboard access failed. You can select and copy the text manually.",
    promptTemplate: `I'm studying Japanese and I just learned these vocabulary words in WaniKani:

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
- Start by asking me your first question now.`
  },
  ja: {
    title: "KaniKai",
    subtitle: "最近覚えたWaniKaniの単語を、実際に使える言葉に変えましょう。",
    langGroup: "言語",
    connectTitle: "1. WaniKaniに接続",
    tokenSavedCompact: "トークンはこの端末に保存されています。",
    manageToken: "トークンを管理",
    tokenHelp: "APIトークンはこのブラウザにのみ保存されます。このプロジェクトファイルには含まれません。",
    tokenLabel: "WaniKani APIトークン",
    tokenPlaceholder: "APIトークンを貼り付けてください",
    saveToken: "トークンを保存",
    forgetToken: "トークンを削除",
    done: "完了",
    tokenFaqSummary: "トークンの取得方法は？",
    tokenFaqBody: "WaniKaniのアカウント設定を開き、API Tokensのセクションを見つけてください。読み取り権限のあるトークンを作成します。このアプリには課題と科目への読み取りアクセスだけが必要です。",
    loadTitle: "2. 最近覚えた単語を取得",
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
    loadHelp: "件数制限を空欄にすると、該当するすべてを表示します。ランダムをオンにすると、制限を適用する前にシャッフルします。",
    recentlyLearned: "最近覚えた単語",
    createPractice: "会話練習を作成",
    copyWordList: "単語リストをコピー",
    practiceTitle: "会話練習プロンプト",
    practiceHelp: "これをChatGPTに貼り付けて会話を始めましょう。プロンプトは一度に一つの質問をするよう指示しています。",
    copyPrompt: "プロンプトをコピー",
    openChatGPT: "ChatGPTを開く",
    pasteTokenFirst: "先にWaniKani APIトークンを貼り付けてください。",
    tokenSaved: "トークンをこのブラウザに保存しました。",
    tokenForgotten: "トークンを削除しました。",
    tokenRejected: "WaniKaniがトークンを拒否しました。正しいトークンか、読み取り権限があるか確認してください。",
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
    clipboardFailed: "クリップボードへのアクセスに失敗しました。手動で選択してコピーしてください。",
    promptTemplate: `日本語を勉強していて、WaniKaniで次の単語を覚えたところです：

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
- 今すぐ最初の質問をして始めてください。`
  }
};
