/**
 * 模拟数据模块
 * 提供新闻、单词、穿搭、灵感、食谱等内容数据
 */

const MockData = {
    // ===== 每日热点新闻 =====
    newsCategories: ['全部', '设计', '科技', '生活', '文娱'],
    
    newsData: {
        '设计': [
            { title: '2026年UI设计趋势：玻璃拟态回归极简', source: '设计之家', time: '2小时前', hot: '热' },
            { title: '苹果发布新设计语言，强调自然质感', source: '设计周', time: '4小时前', hot: '' },
            { title: '品牌视觉升级潮：极简+高饱和撞色', source: '品牌设计', time: '6小时前', hot: '新' },
            { title: '无障碍设计成产品标配，包容性设计崛起', source: 'UX设计', time: '昨天', hot: '' }
        ],
        '科技': [
            { title: 'AI大模型新一轮迭代，多模态能力大幅提升', source: '科技日报', time: '1小时前', hot: '热' },
            { title: '折叠屏手机出货量创新高，形态更成熟', source: '数码前沿', time: '3小时前', hot: '' },
            { title: '智能穿戴设备健康监测功能再升级', source: '科技评论', time: '5小时前', hot: '新' },
            { title: 'Web3.0应用场景探索：从概念到落地', source: '互联网周刊', time: '昨天', hot: '' }
        ],
        '生活': [
            { title: '健康饮食新趋势：植物基蛋白受追捧', source: '健康生活', time: '2小时前', hot: '' },
            { title: '城市微度假成年轻人周末新选择', source: '生活周刊', time: '4小时前', hot: '新' },
            { title: '居家健身热度不减，智能健身镜走俏', source: '品质生活', time: '6小时前', hot: '' },
            { title: '可持续生活方式：零浪费挑战火了', source: '环保生活', time: '昨天', hot: '' }
        ],
        '文娱': [
            { title: '暑期档电影票房创新高，类型多元', source: '娱乐头条', time: '1小时前', hot: '热' },
            { title: '国漫崛起：多部国产动画口碑票房双丰收', source: '动漫资讯', time: '3小时前', hot: '' },
            { title: '音乐节热度回升，年轻人消费意愿强', source: '音乐现场', time: '5小时前', hot: '新' },
            { title: '文博热持续：博物馆文创成网红', source: '文化观察', time: '昨天', hot: '' }
        ]
    },

    getNews(category = '全部') {
        if (category === '全部') {
            const all = [];
            Object.values(this.newsData).forEach(arr => all.push(...arr));
            return this.shuffle(all).slice(0, 5);
        }
        return this.shuffle([...(this.newsData[category] || [])]).slice(0, 4);
    },

    // ===== 艺术插画推荐 =====
    artStyles: [
        { name: '极简水彩插画', style: '水彩风', icon: '🎨' },
        { name: '复古扁平风海报', style: '复古扁平', icon: '🖼️' },
        { name: '国风工笔人物', style: '国风', icon: '🏮' },
        { name: '3D软萌IP形象', style: '3D卡通', icon: '🧸' },
        { name: '线性速写风格', style: '线条艺术', icon: '✏️' },
        { name: '像素艺术怀旧', style: '像素风', icon: '🎮' }
    ],

    getArtRecommendations() {
        return this.shuffle([...this.artStyles]).slice(0, 4);
    },

    // ===== 穿搭推荐 =====
    outfitStyles: {
        spring: [
            { title: '春日温柔针织开衫', tags: ['梨形友好', '显高', '通勤'], desc: '浅色系针织+高腰阔腿裤，温柔又显瘦', icon: '🌸', platforms: ['小红书', '抖音'] },
            { title: '法式碎花连衣裙', tags: ['约会', '温柔风', '春夏'], desc: 'V领收腰设计，修饰身形比例', icon: '👗', platforms: ['小红书', '抖音'] },
            { title: '休闲西装外套穿搭', tags: ['通勤', '干练', '百搭'], desc: 'oversize西装+牛仔裤，又A又飒', icon: '🧥', platforms: ['小红书'] },
            { title: '衬衫+半裙学院风', tags: ['减龄', '学院风', '清新'], desc: '白衬衫+百褶半裙，青春感满满', icon: '👔', platforms: ['抖音'] }
        ],
        summer: [
            { title: '清凉吊带+防晒衫', tags: ['显瘦', '度假风', '夏日'], desc: '吊带外搭薄款防晒衫，又美又防晒', icon: '🌞', platforms: ['小红书', '抖音'] },
            { title: '高腰阔腿牛仔裤', tags: ['梨形救星', '显腿长', '百搭'], desc: '高腰设计+阔腿版型，遮肉显瘦', icon: '👖', platforms: ['小红书'] },
            { title: 'T恤+半身裙', tags: ['休闲', '减龄', '日常'], desc: '简约T恤+A字半裙，清爽又好看', icon: '👚', platforms: ['抖音'] },
            { title: '法式方领连衣裙', tags: ['优雅', '显瘦', '约会'], desc: '方领设计修饰肩颈线条', icon: '🌺', platforms: ['小红书', '抖音'] }
        ],
        autumn: [
            { title: '风衣+高领打底', tags: ['气质', '通勤', '经典'], desc: '卡其色风衣永不过时，气场全开', icon: '🍂', platforms: ['小红书'] },
            { title: '卫衣+直筒裤', tags: ['休闲', '舒适', '日常'], desc: 'oversize卫衣+直筒裤，慵懒随性', icon: '👕', platforms: ['抖音'] },
            { title: '针织马甲叠穿', tags: ['叠穿', '学院风', '减龄'], desc: '针织马甲+衬衫，层次感满分', icon: '🧶', platforms: ['小红书', '抖音'] },
            { title: '皮衣+连衣裙', tags: ['酷飒', '甜酷', '约会'], desc: '皮衣中和裙装的柔美，甜酷平衡', icon: '🖤', platforms: ['小红书'] }
        ],
        winter: [
            { title: '大衣+高领毛衣', tags: ['气质', '保暖', '通勤'], desc: '长款大衣+高领内搭，高级感拉满', icon: '🧥', platforms: ['小红书', '抖音'] },
            { title: '羽绒服+牛仔裤', tags: ['保暖', '休闲', '日常'], desc: '短款羽绒服显高又保暖', icon: '❄️', platforms: ['抖音'] },
            { title: '毛呢套装', tags: ['通勤', '干练', '气质'], desc: '同色系套装，省时又好看', icon: '👔', platforms: ['小红书'] },
            { title: '围巾+帽子配饰', tags: ['配饰', '保暖', '点缀'], desc: '围巾帽子提升整体造型感', icon: '🧣', platforms: ['小红书', '抖音'] }
        ]
    },

    getOutfitRecommendations(season = 'summer', bodyType = 'average') {
        const outfits = this.outfitStyles[season] || this.outfitStyles.summer;
        return this.shuffle([...outfits]).slice(0, 3);
    },

    // ===== 雅思单词 =====
    ieltsWordsList: [
        { word: 'abandon', phonetic: '/əˈbændən/', meaning: 'v. 放弃，抛弃', example: 'He abandoned his car in the snow.' },
        { word: 'ability', phonetic: '/əˈbɪləti/', meaning: 'n. 能力，才能', example: 'She has the ability to solve problems.' },
        { word: 'absolute', phonetic: '/ˈæbsəluːt/', meaning: 'adj. 绝对的，完全的', example: 'I have absolute confidence in her.' },
        { word: 'absorb', phonetic: '/əbˈzɔːrb/', meaning: 'v. 吸收，吸引', example: 'Plants absorb carbon dioxide.' },
        { word: 'abstract', phonetic: '/ˈæbstrækt/', meaning: 'adj. 抽象的 n. 摘要', example: 'Abstract art is not for everyone.' },
        { word: 'academic', phonetic: '/ˌækəˈdemɪk/', meaning: 'adj. 学术的，学院的', example: 'She pursued an academic career.' },
        { word: 'accelerate', phonetic: '/əkˈseləreɪt/', meaning: 'v. 加速，促进', example: 'The car accelerated quickly.' },
        { word: 'access', phonetic: '/ˈækses/', meaning: 'n. 通道，使用权 v. 访问', example: 'Students have access to the library.' },
        { word: 'accommodate', phonetic: '/əˈkɒmədeɪt/', meaning: 'v. 容纳，适应', example: 'The hotel can accommodate 200 guests.' },
        { word: 'accompany', phonetic: '/əˈkʌmpəni/', meaning: 'v. 陪伴，伴随', example: 'She accompanied me to the doctor.' },
        { word: 'accomplish', phonetic: '/əˈkʌmplɪʃ/', meaning: 'v. 完成，实现', example: 'He accomplished his goal.' },
        { word: 'accumulate', phonetic: '/əˈkjuːmjəleɪt/', meaning: 'v. 积累，积聚', example: 'Dust accumulates quickly in the city.' },
        { word: 'accurate', phonetic: '/ˈækjərət/', meaning: 'adj. 准确的，精确的', example: 'The data is accurate and reliable.' },
        { word: 'achieve', phonetic: '/əˈtʃiːv/', meaning: 'v. 达到，实现', example: 'She achieved great success.' },
        { word: 'acknowledge', phonetic: '/əkˈnɒlɪdʒ/', meaning: 'v. 承认，感谢', example: 'He acknowledged his mistake.' },
        { word: 'acquire', phonetic: '/əˈkwaɪər/', meaning: 'v. 获得，取得', example: 'She acquired new skills.' },
        { word: 'adapt', phonetic: '/əˈdæpt/', meaning: 'v. 适应，改编', example: 'Animals adapt to their environment.' },
        { word: 'adequate', phonetic: '/ˈædɪkwət/', meaning: 'adj. 足够的，适当的', example: 'We have adequate resources.' },
        { word: 'adjust', phonetic: '/əˈdʒʌst/', meaning: 'v. 调整，适应', example: 'Please adjust the volume.' },
        { word: 'administrate', phonetic: '/ədˈmɪnɪstreɪt/', meaning: 'v. 管理，行政', example: 'She administrates the department.' }
    ],

    getIeltsWords(count = 15) {
        return this.shuffle([...this.ieltsWordsList]).slice(0, count);
    },

    // ===== 核心词汇 =====
    vocabWordsList: [
        { word: 'vibe', pos: 'n.', collocation: '好的氛围/感觉', example: 'This place has a good vibe.' },
        { word: 'chill', pos: 'adj./v.', collocation: '放松的/冷静', example: 'Let\'s just chill at home.' },
        { word: 'crush', pos: 'n./v.', collocation: '心动/迷恋', example: 'I have a crush on him.' },
        { word: 'deadline', pos: 'n.', collocation: '截止日期', example: 'The deadline is tomorrow.' },
        { word: 'burnout', pos: 'n.', collocation: ' burnout 职业倦怠', example: 'She experienced burnout at work.' },
        { word: 'mindset', pos: 'n.', collocation: '思维模式/心态', example: 'A growth mindset is important.' },
        { word: 'hustle', pos: 'n./v.', collocation: '努力奋斗', example: 'The hustle culture is popular.' },
        { word: 'self-care', pos: 'n.', collocation: '自我关怀', example: 'Self-care is not selfish.' },
        { word: 'trigger', pos: 'n./v.', collocation: '触发/导火索', example: 'Stress can trigger headaches.' },
        { word: 'empathy', pos: 'n.', collocation: '同理心/共情', example: 'Empathy is a valuable trait.' },
        { word: 'resilience', pos: 'n.', collocation: '韧性/复原力', example: 'Mental resilience is key.' },
        { word: 'procrastinate', pos: 'v.', collocation: '拖延', example: 'Stop procrastinating!' },
        { word: 'optimize', pos: 'v.', collocation: '优化', example: 'We need to optimize the process.' },
        { word: 'sustainable', pos: 'adj.', collocation: '可持续的', example: 'Sustainable living is important.' },
        { word: 'authentic', pos: 'adj.', collocation: '真实的/正宗的', example: 'Be your authentic self.' },
        { word: 'diverse', pos: 'adj.', collocation: '多样的/多元的', example: 'A diverse team is innovative.' },
        { word: 'prioritize', pos: 'v.', collocation: '优先排序', example: 'Learn to prioritize your tasks.' },
        { word: 'collaborate', pos: 'v.', collocation: '合作/协作', example: 'We collaborate with other teams.' },
        { word: 'innovate', pos: 'v.', collocation: '创新', example: 'Companies must innovate to survive.' },
        { word: 'motivate', pos: 'v.', collocation: '激励/激发', example: 'Good leaders motivate their team.' }
    ],

    getVocabWords(count = 10) {
        return this.shuffle([...this.vocabWordsList]).slice(0, count);
    },

    // ===== 口语场景对话 =====
    dialogueScenes: [
        {
            scene: '咖啡店点单',
            lines: [
                { speaker: 'A', en: 'Hi, what can I get for you today?', zh: '您好，请问要点什么？' },
                { speaker: 'B', en: 'I\'d like a medium latte, please.', zh: '我要一杯中杯拿铁，谢谢。' },
                { speaker: 'A', en: 'Hot or iced? And any sugar?', zh: '热的还是冰的？需要加糖吗？' },
                { speaker: 'B', en: 'Iced, please. No sugar, just a little milk.', zh: '冰的，不加糖，少奶。' },
                { speaker: 'A', en: 'Sure. Anything else?', zh: '好的，还要别的吗？' },
                { speaker: 'B', en: 'That\'s all. How much is it?', zh: '就这些，多少钱？' },
                { speaker: 'A', en: 'That\'ll be 28 yuan. Your order number is 15.', zh: '一共28元，您的取餐号是15号。' }
            ]
        },
        {
            scene: '机场值机',
            lines: [
                { speaker: 'A', en: 'Good morning, may I see your passport?', zh: '早上好，请出示您的护照。' },
                { speaker: 'B', en: 'Sure, here you are.', zh: '好的，给您。' },
                { speaker: 'A', en: 'Window seat or aisle seat?', zh: '您想要靠窗还是过道座位？' },
                { speaker: 'B', en: 'Window seat, please. And can I have an exit row?', zh: '靠窗的，能给我紧急出口那排吗？' },
                { speaker: 'A', en: 'Let me check... Yes, there\'s one available.', zh: '我查一下...有的，还有一个空位。' },
                { speaker: 'B', en: 'Great, thank you so much.', zh: '太好了，非常感谢。' },
                { speaker: 'A', en: 'You\'re welcome. Boarding starts at 9:30 at gate 12.', zh: '不客气，9:30开始在12号登机口登机。' }
            ]
        },
        {
            scene: '健身房咨询',
            lines: [
                { speaker: 'A', en: 'Hi, I\'m interested in getting a membership.', zh: '你好，我想办健身卡。' },
                { speaker: 'B', en: 'Great! What kind of workouts do you usually do?', zh: '好的！您平时做什么类型的运动？' },
                { speaker: 'A', en: 'Mostly cardio and some weight training.', zh: '主要是有氧，偶尔做力量训练。' },
                { speaker: 'B', en: 'Our basic membership includes all equipment and group classes.', zh: '我们的基础会员包含所有器械和团课。' },
                { speaker: 'A', en: 'How much is the monthly fee?', zh: '月卡多少钱？' },
                { speaker: 'B', en: 'It\'s 299 per month, or 2999 for a year.', zh: '月卡299，年卡2999。' },
                { speaker: 'A', en: 'Can I try a free day pass first?', zh: '我可以先体验一天吗？' }
            ]
        },
        {
            scene: '租房看房',
            lines: [
                { speaker: 'A', en: 'Welcome! Let me show you around the apartment.', zh: '欢迎！我带您看看房子。' },
                { speaker: 'B', en: 'Thanks. Is the rent inclusive of utilities?', zh: '谢谢，房租包含水电吗？' },
                { speaker: 'A', en: 'Water is included, but electricity is separate.', zh: '水费包含，电费另算。' },
                { speaker: 'B', en: 'How about internet and heating?', zh: '网费和暖气呢？' },
                { speaker: 'A', en: 'Internet is 50 per month, heating is included in winter.', zh: '网费每月50，冬天暖气费包含。' },
                { speaker: 'B', en: 'What\'s the minimum lease term?', zh: '最短租多久？' },
                { speaker: 'A', en: 'One year minimum, with one month deposit.', zh: '最少一年，押一付三。' }
            ]
        },
        {
            scene: '面试自我介绍',
            lines: [
                { speaker: 'A', en: 'Please introduce yourself briefly.', zh: '请简单介绍一下你自己。' },
                { speaker: 'B', en: 'I graduated from university with a design degree.', zh: '我大学学的是设计专业。' },
                { speaker: 'A', en: 'What\'s your greatest strength?', zh: '你最大的优点是什么？' },
                { speaker: 'B', en: 'I\'m very detail-oriented and a quick learner.', zh: '我注重细节，学习能力也很强。' },
                { speaker: 'A', en: 'Why do you want this position?', zh: '你为什么想要这个职位？' },
                { speaker: 'B', en: 'I\'m passionate about design and this role fits perfectly.', zh: '我热爱设计，这个岗位非常适合我。' },
                { speaker: 'A', en: 'Great. We\'ll get back to you in 3 days.', zh: '很好，我们三天内给你答复。' }
            ]
        }
    ],

    getDialogue() {
        return this.dialogueScenes[Math.floor(Math.random() * this.dialogueScenes.length)];
    },

    // ===== 健康食谱 =====
    mealPlans: [
        {
            breakfast: {
                name: '燕麦牛奶+水煮蛋+蓝莓',
                ingredients: '燕麦50g、牛奶250ml、鸡蛋1个、蓝莓50g',
                calories: 350,
                cost: 12,
                videoUrl: 'https://www.douyin.com/search/燕麦牛奶早餐做法'
            },
            lunch: {
                name: '鸡胸肉藜麦沙拉',
                ingredients: '鸡胸肉150g、藜麦100g、混合蔬菜200g、橄榄油',
                calories: 450,
                cost: 25,
                videoUrl: 'https://www.douyin.com/search/鸡胸肉藜麦沙拉做法'
            },
            dinner: {
                name: '清蒸鲈鱼+糙米饭+西兰花',
                ingredients: '鲈鱼200g、糙米80g、西兰花150g',
                calories: 380,
                cost: 35,
                videoUrl: 'https://www.douyin.com/search/清蒸鲈鱼做法'
            }
        },
        {
            breakfast: {
                name: '全麦三明治+黑咖啡',
                ingredients: '全麦面包2片、鸡蛋1个、生菜、番茄、火腿',
                calories: 380,
                cost: 10,
                videoUrl: 'https://www.douyin.com/search/全麦三明治做法'
            },
            lunch: {
                name: '牛肉西兰花炒饭',
                ingredients: '牛肉100g、西兰花100g、糙米饭150g、胡萝卜',
                calories: 500,
                cost: 28,
                videoUrl: 'https://www.douyin.com/search/牛肉西兰花炒饭做法'
            },
            dinner: {
                name: '虾仁豆腐汤+小份米饭',
                ingredients: '虾仁100g、嫩豆腐1盒、青菜、米饭100g',
                calories: 350,
                cost: 22,
                videoUrl: 'https://www.douyin.com/search/虾仁豆腐汤做法'
            }
        },
        {
            breakfast: {
                name: '希腊酸奶+坚果+香蕉',
                ingredients: '希腊酸奶200g、混合坚果30g、香蕉1根',
                calories: 360,
                cost: 15,
                videoUrl: 'https://www.douyin.com/search/希腊酸奶碗做法'
            },
            lunch: {
                name: '三文鱼牛油果拌饭',
                ingredients: '三文鱼100g、牛油果半个、米饭150g、海苔',
                calories: 520,
                cost: 45,
                videoUrl: 'https://www.douyin.com/search/三文鱼牛油果拌饭做法'
            },
            dinner: {
                name: '番茄鸡蛋面+青菜',
                ingredients: '番茄2个、鸡蛋2个、面条100g、青菜',
                calories: 400,
                cost: 8,
                videoUrl: 'https://www.douyin.com/search/番茄鸡蛋面做法'
            }
        }
    ],

    getMealPlan() {
        return this.mealPlans[Math.floor(Math.random() * this.mealPlans.length)];
    },

    // ===== 运动视频 =====
    sportVideos: [
        { name: '30分钟燃脂有氧操', type: '有氧', duration: '30分钟', icon: '🏃', url: 'https://www.douyin.com/search/30分钟燃脂有氧操' },
        { name: '15分钟肩颈舒缓', type: '拉伸', duration: '15分钟', icon: '🧘', url: 'https://www.douyin.com/search/肩颈舒缓拉伸' },
        { name: '20分钟臀腿训练', type: '力量', duration: '20分钟', icon: '🍑', url: 'https://www.douyin.com/search/臀腿力量训练' },
        { name: '10分钟晨间唤醒', type: '拉伸', duration: '10分钟', icon: '🌅', url: 'https://www.douyin.com/search/晨间唤醒运动' },
        { name: '25分钟HIIT燃脂', type: 'HIIT', duration: '25分钟', icon: '🔥', url: 'https://www.douyin.com/search/HIIT燃脂训练' },
        { name: '20分钟腹部训练', type: '力量', duration: '20分钟', icon: '💪', url: 'https://www.douyin.com/search/腹部力量训练' }
    ],

    getSportVideos(count = 4) {
        return this.shuffle([...this.sportVideos]).slice(0, count);
    },

    // ===== 灵感素材 =====
    inspirationData: {
        '拼贴排版': [
            { title: '复古杂志拼贴风', source: 'Pinterest', icon: '📰', url: 'https://www.pinterest.com/search/pins/?q=collage%20design' },
            { title: '几何切割排版', source: 'Behance', icon: '🔷', url: 'https://www.behance.net/search?search=geometric%20layout' },
            { title: '蒸汽波风格拼贴', source: '小红书', icon: '🌊', url: 'https://www.xiaohongshu.com/search_result?keyword=蒸汽波拼贴' },
            { title: '自然元素拼贴', source: '古村田路9号', icon: '🌿', url: 'https://www.xiaohongshu.com/search_result?keyword=自然拼贴排版' },
            { title: '故障艺术排版', source: 'Behance', icon: '📺', url: 'https://www.behance.net/search?search=glitch%20art' },
            { title: '极简留白排版', source: 'Pinterest', icon: '⬜', url: 'https://www.pinterest.com/search/pins/?q=minimal%20layout' }
        ],
        '有趣文创': [
            { title: '创意冰箱贴设计', source: '小红书', icon: '🧲', url: 'https://www.xiaohongshu.com/search_result?keyword=创意冰箱贴' },
            { title: '国风文创周边', source: '古村田路9号', icon: '🏮', url: 'https://www.xiaohongshu.com/search_result?keyword=国风文创' },
            { title: '手账贴纸设计', source: 'Pinterest', icon: '📝', url: 'https://www.pinterest.com/search/pins/?q=stationery%20stickers' },
            { title: '亚克力钥匙扣', source: '小红书', icon: '🔑', url: 'https://www.xiaohongshu.com/search_result?keyword=亚克力钥匙扣' },
            { title: '创意帆布袋设计', source: 'Behance', icon: '👜', url: 'https://www.behance.net/search?search=totebag%20design' },
            { title: '香薰蜡烛包装', source: 'Pinterest', icon: '🕯️', url: 'https://www.pinterest.com/search/pins/?q=candle%20packaging' }
        ],
        '热门艺术风格': [
            { title: 'Y2K千禧风格', source: '小红书', icon: '💿', url: 'https://www.xiaohongshu.com/search_result?keyword=Y2K风格' },
            { title: '新丑风设计', source: 'Behance', icon: '🎭', url: 'https://www.behance.net/search?search=brutalist%20design' },
            { title: '酸性平面设计', source: 'Pinterest', icon: '🧪', url: 'https://www.pinterest.com/search/pins/?q=acid%20graphic' },
            { title: '孟菲斯风格', source: '古村田路9号', icon: '🌈', url: 'https://www.xiaohongshu.com/search_result?keyword=孟菲斯风格' },
            { title: '赛博朋克风', source: 'Behance', icon: '🌃', url: 'https://www.behance.net/search?search=cyberpunk' },
            { title: '治愈系插画', source: '小红书', icon: '🌸', url: 'https://www.xiaohongshu.com/search_result?keyword=治愈系插画' }
        ]
    },

    getInspiration(category = '拼贴排版') {
        return this.inspirationData[category] || this.inspirationData['拼贴排版'];
    },

    // ===== 记账分类 =====
    expenseCategories: [
        { name: '餐饮', icon: '🍜' },
        { name: '交通', icon: '🚗' },
        { name: '购物', icon: '🛍️' },
        { name: '学习', icon: '📚' },
        { name: '健康', icon: '💊' },
        { name: '服饰', icon: '👕' },
        { name: '娱乐', icon: '🎮' },
        { name: '居住', icon: '🏠' },
        { name: '通讯', icon: '📱' },
        { name: '其他', icon: '📦' }
    ],

    incomeCategories: [
        { name: '工资', icon: '💰' },
        { name: '兼职', icon: '💼' },
        { name: '理财', icon: '📈' },
        { name: '红包', icon: '🧧' },
        { name: '退款', icon: '↩️' },
        { name: '其他', icon: '💎' }
    ],

    // ===== 工具方法 =====
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    // 获取当前季节
    getCurrentSeason() {
        const month = new Date().getMonth() + 1;
        if (month >= 3 && month <= 5) return 'spring';
        if (month >= 6 && month <= 8) return 'summer';
        if (month >= 9 && month <= 11) return 'autumn';
        return 'winter';
    },

    // 获取季节中文名
    getSeasonName(season) {
        const names = { spring: '春季', summer: '夏季', autumn: '秋季', winter: '冬季' };
        return names[season] || '夏季';
    },

    // 获取时段问候
    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 6) return '凌晨好';
        if (hour < 9) return '早上好';
        if (hour < 12) return '上午好';
        if (hour < 14) return '中午好';
        if (hour < 18) return '下午好';
        if (hour < 22) return '晚上好';
        return '夜深了';
    }
};
