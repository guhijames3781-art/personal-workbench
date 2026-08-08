/**
 * 个人成长工作台 - 主应用逻辑
 */

const App = {
    currentPage: 'home',
    billType: 'expense',
    selectedCategory: null,
    currentNewsTab: '全部',
    currentKnowledgeTab: 'english',
    currentInspirationCat: '拼贴排版',
    currentPlanTab: 'today',
    weekOffset: 0,
    englishData: null,
    ieltsWords: [],
    vocabWords: [],
    dialogue: null,

    init() {
        this.bindEvents();
        this.renderPage('home');
        this.updateBillSummary();
        this.initEnglishData();
    },

    // ===== 事件绑定 =====
    bindEvents() {
        // 底部导航
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                if (page === 'bill') {
                    this.openBillModal();
                } else {
                    this.renderPage(page);
                    this.setActiveNav(page);
                }
            });
        });

        // 记账浮层关闭
        document.getElementById('billModalClose').addEventListener('click', () => {
            this.closeBillModal();
        });

        // 记账类型切换
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.billType = btn.dataset.type;
                document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderBillCategories();
            });
        });

        // 保存账单
        document.getElementById('billSaveBtn').addEventListener('click', () => {
            this.saveBill();
        });

        // 查看完整账单
        document.getElementById('billDetailLink').addEventListener('click', () => {
            this.closeBillModal();
            this.renderPage('billDetail');
            this.setActiveNav('bill');
        });

        // 点击浮层背景关闭
        document.getElementById('billModal').addEventListener('click', (e) => {
            if (e.target.id === 'billModal') {
                this.closeBillModal();
            }
        });

        // 日期默认今天
        document.getElementById('billDate').value = new Date().toISOString().split('T')[0];
    },

    setActiveNav(page) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });
    },

    // ===== 页面渲染 =====
    renderPage(page) {
        this.currentPage = page;
        const content = document.getElementById('mainContent');
        
        switch(page) {
            case 'home':
                content.innerHTML = this.renderHome();
                this.bindHomeEvents();
                break;
            case 'plan':
                content.innerHTML = this.renderPlan();
                this.bindPlanEvents();
                break;
            case 'knowledge':
                content.innerHTML = this.renderKnowledge();
                this.bindKnowledgeEvents();
                break;
            case 'profile':
                content.innerHTML = this.renderProfile();
                this.bindProfileEvents();
                break;
            case 'billDetail':
                content.innerHTML = this.renderBillDetail();
                this.bindBillDetailEvents();
                break;
        }
        
        window.scrollTo(0, 0);
    },

    // ===== 首页 =====
    renderHome() {
        const settings = Storage.getSettings();
        const greeting = MockData.getGreeting();
        const season = MockData.getCurrentSeason();
        const seasonName = MockData.getSeasonName(season);
        const todayPlans = Storage.getTodayPlans();
        const news = MockData.getNews(this.currentNewsTab);
        const arts = MockData.getArtRecommendations();
        const outfits = MockData.getOutfitRecommendations(season, settings.bodyType);

        const dateStr = this.formatDate(new Date());

        return `
            <div class="greeting-section">
                <div style="display: flex; align-items: flex-start;">
                    <div>
                        <div class="greeting-text">${greeting}，${settings.nickname}</div>
                        <div class="greeting-sub">
                            <span>${dateStr}</span>
                            <span class="season-tag">${seasonName}</span>
                        </div>
                    </div>
                    <div class="points-badge">🌱 成长积分</div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-title"><span class="icon">📋</span>今日计划</div>
                    <div class="card-action" onclick="app.renderPage('plan'); app.setActiveNav('plan')">全部 →</div>
                </div>
                ${todayPlans.length === 0 ? `
                    <div class="plan-empty">今天还没有计划，去添加一个吧～</div>
                ` : `
                    ${todayPlans.slice(0, 4).map(plan => `
                        <div class="plan-preview-item ${plan.completed ? 'completed' : ''}" data-id="${plan.id}">
                            <div class="checkbox ${plan.completed ? 'checked' : ''}" onclick="app.togglePlan(${plan.id}, 'home')"></div>
                            <span class="plan-text">${plan.name}</span>
                            ${plan.note ? `<span class="plan-tag">${plan.note}</span>` : ''}
                        </div>
                    `).join('')}
                `}
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-title"><span class="icon">🔥</span>每日热点</div>
                    <div class="card-action" onclick="app.refreshNews()">换一批</div>
                </div>
                <div class="news-tabs">
                    ${MockData.newsCategories.map(cat => `
                        <div class="news-tab ${cat === this.currentNewsTab ? 'active' : ''}" onclick="app.switchNewsTab('${cat}')">${cat}</div>
                    `).join('')}
                </div>
                ${news.map(item => `
                    <div class="news-item">
                        <div class="news-title">${item.title}</div>
                        <div class="news-meta">
                            <span>${item.source}</span>
                            <span>${item.time}</span>
                            ${item.hot ? `<span class="hot-tag">${item.hot}</span>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="section-title">
                <span>✨ 每日精选</span>
                <span class="refresh-btn" onclick="app.refreshDaily()">换一批</span>
            </div>

            <div class="card">
                <div class="sub-section-title">
                    <span>🎨 艺术灵感</span>
                    <span class="more-link" onclick="app.renderPage('knowledge'); app.setActiveNav('knowledge'); app.switchKnowledgeTab('inspiration')">更多 →</span>
                </div>
                <div class="art-grid">
                    ${arts.map(art => `
                        <div class="art-card">
                            <div class="art-image">${art.icon}</div>
                            <div class="art-info">
                                <div class="art-name">${art.name}</div>
                                <div class="art-style">${art.style}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="card">
                <div class="sub-section-title">
                    <span>👗 穿搭推荐</span>
                    <span class="more-link" onclick="app.openProfileSettings()">匹配设置</span>
                </div>
                <div class="match-tip">
                    <span>💡</span>
                    <span>根据你的身形数据 + ${seasonName}气温 智能匹配</span>
                </div>
                ${outfits.map(outfit => `
                    <div class="outfit-card">
                        <div class="outfit-image">${outfit.icon}</div>
                        <div class="outfit-info">
                            <div class="outfit-title">${outfit.title}</div>
                            <div class="outfit-tags">
                                ${outfit.tags.map(tag => `<span class="tag tag-primary">${tag}</span>`).join('')}
                            </div>
                            <div class="outfit-desc">${outfit.desc}</div>
                            <div class="outfit-source">
                                ${outfit.platforms.map(p => `
                                    <span class="source-btn" onclick="app.openOutfitLink('${p}', '${outfit.title}')">${p}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    bindHomeEvents() {
        // 首页事件已通过 onclick 绑定
    },

    switchNewsTab(cat) {
        this.currentNewsTab = cat;
        this.renderPage('home');
    },

    refreshNews() {
        this.renderPage('home');
    },

    refreshDaily() {
        this.renderPage('home');
    },

    togglePlan(id, from) {
        Storage.togglePlan(id);
        if (from === 'home') {
            this.renderPage('home');
        } else {
            this.renderPlanContent();
        }
    },

    openOutfitLink(platform, keyword) {
        let url = '';
        if (platform === '小红书') {
            url = `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(keyword)}`;
        } else if (platform === '抖音') {
            url = `https://www.douyin.com/search/${encodeURIComponent(keyword)}`;
        }
        if (url) window.open(url, '_blank');
    },

    // ===== 计划页 =====
    renderPlan() {
        return `
            <div class="page-header">
                <div class="page-title">计划管理</div>
                <div class="page-subtitle">规划每一天，遇见更好的自己</div>
            </div>

            <div class="plan-tabs">
                <div class="plan-tab ${this.currentPlanTab === 'today' ? 'active' : ''}" onclick="app.switchPlanTab('today')">今日计划</div>
                <div class="plan-tab ${this.currentPlanTab === 'week' ? 'active' : ''}" onclick="app.switchPlanTab('week')">本周统计</div>
            </div>

            <div id="planContent">
                ${this.currentPlanTab === 'today' ? this.renderTodayPlan() : this.renderWeekPlan()}
            </div>

            <div class="health-section">
                <div class="section-title" style="margin-top: 24px;">
                    <span>💪 健康任务</span>
                </div>
                ${this.renderHealthSection()}
            </div>
        `;
    },

    renderTodayPlan() {
        const todayPlans = Storage.getTodayPlans();
        const today = new Date().toISOString().split('T')[0];

        return `
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><span class="icon">📝</span>今日计划</div>
                    <div style="font-size: 13px; color: var(--text-secondary);">${this.formatDate(new Date())}</div>
                </div>
                <div class="plan-form">
                    <input type="text" class="input" id="planNameInput" placeholder="任务名称" style="flex: 2;">
                    <input type="date" class="input" id="planDateInput" value="${today}" style="flex: 1;">
                    <input type="text" class="input" id="planNoteInput" placeholder="备注（选填）" style="flex: 1.5;">
                    <button class="btn btn-primary" onclick="app.addPlan()">添加</button>
                </div>
                ${todayPlans.length === 0 ? `
                    <div class="plan-empty">今天还没有计划，快添加一个吧～</div>
                ` : `
                    ${todayPlans.map(plan => `
                        <div class="task-item ${plan.completed ? 'completed' : ''}">
                            <div class="checkbox ${plan.completed ? 'checked' : ''}" onclick="app.togglePlan(${plan.id}, 'plan')"></div>
                            <div class="task-content">
                                <div class="task-name">${plan.name}</div>
                                ${plan.note ? `<div class="task-note">${plan.note}</div>` : ''}
                            </div>
                            <span class="task-date">今日</span>
                            <span class="delete-btn" onclick="app.deletePlan(${plan.id})">🗑️</span>
                        </div>
                    `).join('')}
                `}
            </div>
        `;
    },

    renderWeekPlan() {
        const weekStart = this.getWeekStart(this.weekOffset);
        const weekPlans = Storage.getWeekPlans(weekStart);
        const weekDays = this.getWeekDays(weekStart);
        
        const total = weekPlans.length;
        const completed = weekPlans.filter(p => p.completed).length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        const weekLabel = this.getWeekLabel(weekStart);

        return `
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><span class="icon">📊</span>本周计划汇总</div>
                </div>
                <div class="week-nav">
                    <button onclick="app.changeWeek(-1)">← 上一周</button>
                    <span class="week-label">${weekLabel}</span>
                    <button onclick="app.changeWeek(1)">下一周 →</button>
                </div>
                <div class="week-progress">
                    <div class="week-progress-bar">
                        <div class="week-progress-fill" style="width: ${rate}%"></div>
                    </div>
                    <div class="week-progress-text">
                        <span>完成进度</span>
                        <span>${completed}/${total} 项 · ${rate}%</span>
                    </div>
                </div>
                ${weekDays.map(day => {
                    const dayPlans = weekPlans.filter(p => p.date === day.dateStr);
                    const dayCompleted = dayPlans.filter(p => p.completed).length;
                    return `
                        <div class="week-day-group">
                            <div class="week-day-header">
                                <span>${day.dayName} · ${day.dateStr.slice(5)}</span>
                                <span class="day-progress">${dayCompleted}/${dayPlans.length}</span>
                            </div>
                            ${dayPlans.length === 0 ? `
                                <div style="padding: 8px 0; font-size: 12px; color: var(--text-light);">暂无计划</div>
                            ` : dayPlans.map(plan => `
                                <div class="task-item ${plan.completed ? 'completed' : ''}" style="padding-left: 10px;">
                                    <div class="checkbox ${plan.completed ? 'checked' : ''}" onclick="app.togglePlan(${plan.id}, 'plan')"></div>
                                    <div class="task-content">
                                        <div class="task-name">${plan.name}</div>
                                        ${plan.note ? `<div class="task-note">${plan.note}</div>` : ''}
                                    </div>
                                    <span class="delete-btn" onclick="app.deletePlan(${plan.id})">🗑️</span>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    renderHealthSection() {
        const bodyData = Storage.getBodyData();
        const bmi = Storage.calculateBMI(bodyData.height, bodyData.weight);
        const bmiStatus = Storage.getBMIStatus(bmi);
        const bmr = Storage.calculateBMR(bodyData.height, bodyData.weight, 25, bodyData.gender);
        const tdee = Storage.calculateTDEE(bmr, bodyData.activityLevel);
        
        const mealPlan = MockData.getMealPlan();
        const totalCost = mealPlan.breakfast.cost + mealPlan.lunch.cost + mealPlan.dinner.cost;
        
        const sports = MockData.getSportVideos(4);

        return `
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><span class="icon">📏</span>身体数据档案</div>
                    <div class="card-action" onclick="app.editBodyData()">编辑</div>
                </div>
                <div class="body-form">
                    <div>
                        <label style="font-size: 12px; color: var(--text-secondary); display: block; margin-bottom: 4px;">身高 (cm)</label>
                        <input type="number" class="input" id="bodyHeight" value="${bodyData.height}" onchange="app.updateBodyData()">
                    </div>
                    <div>
                        <label style="font-size: 12px; color: var(--text-secondary); display: block; margin-bottom: 4px;">体重 (kg)</label>
                        <input type="number" class="input" id="bodyWeight" value="${bodyData.weight}" onchange="app.updateBodyData()">
                    </div>
                </div>
                <div class="body-stats">
                    <div class="stat-card">
                        <div class="stat-value">${bmi}</div>
                        <div class="stat-label">BMI 指数</div>
                        <div class="stat-status" style="color: ${bmiStatus.color}">${bmiStatus.text}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${bmr}</div>
                        <div class="stat-label">基础代谢</div>
                        <div class="stat-status">kcal/天</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${tdee}</div>
                        <div class="stat-label">每日消耗</div>
                        <div class="stat-status">kcal/天</div>
                    </div>
                </div>
                <button class="btn btn-primary btn-block" onclick="app.refreshMealPlan()">🔄 生成健康方案</button>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-title"><span class="icon">🥗</span>今日健康食谱</div>
                    <div class="card-action" onclick="app.refreshMealPlan()">换一批</div>
                </div>
                <div class="budget-tip">
                    <span>💰</span>
                    <span>今日食材预估 ¥${totalCost} · 本周累计预算管理中</span>
                </div>
                ${['breakfast', 'lunch', 'dinner'].map(meal => {
                    const mealNames = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' };
                    const mealData = mealPlan[meal];
                    return `
                        <div class="meal-card">
                            <div class="meal-header">
                                <span class="meal-type">${mealNames[meal]}</span>
                                <span class="meal-video-btn" onclick="window.open('${mealData.videoUrl}', '_blank')">
                                    🎬 抖音做法
                                </span>
                            </div>
                            <div class="meal-name">${mealData.name}</div>
                            <div class="meal-ingredients">食材：${mealData.ingredients}</div>
                            <div class="meal-footer">
                                <span>🔥 ${mealData.calories} kcal</span>
                                <span class="meal-cost">¥${mealData.cost}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-title"><span class="icon">🏃</span>配套运动推荐</div>
                    <div class="card-action">更多 →</div>
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">
                    💡 根据你的BMI与身体数据，推荐以下适配强度运动
                </div>
                <div class="sport-grid">
                    ${sports.map(sport => `
                        <div class="sport-card" onclick="window.open('${sport.url}', '_blank')">
                            <div class="sport-cover">
                                ${sport.icon}
                                <span class="sport-duration">${sport.duration}</span>
                            </div>
                            <div class="sport-info">
                                <div class="sport-name">${sport.name}</div>
                                <div class="sport-type">
                                    <span>${sport.type}</span>
                                    <span class="play-btn">去跟练 →</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    bindPlanEvents() {
        // 事件已通过 onclick 绑定
    },

    switchPlanTab(tab) {
        this.currentPlanTab = tab;
        this.renderPage('plan');
    },

    renderPlanContent() {
        const content = document.getElementById('planContent');
        if (content) {
            content.innerHTML = this.currentPlanTab === 'today' ? this.renderTodayPlan() : this.renderWeekPlan();
        } else {
            this.renderPage('plan');
        }
    },

    addPlan() {
        const name = document.getElementById('planNameInput').value.trim();
        const date = document.getElementById('planDateInput').value;
        const note = document.getElementById('planNoteInput').value.trim();
        
        if (!name) {
            alert('请输入任务名称');
            return;
        }
        
        Storage.addPlan({ name, date, note });
        this.renderPlanContent();
    },

    deletePlan(id) {
        if (confirm('确定删除这个任务吗？')) {
            Storage.deletePlan(id);
            this.renderPlanContent();
        }
    },

    changeWeek(offset) {
        this.weekOffset += offset;
        this.renderPlanContent();
    },

    getWeekStart(offset = 0) {
        const now = new Date();
        const day = now.getDay();
        const diff = day === 0 ? -6 : 1 - day; // 周一为一周开始
        const monday = new Date(now);
        monday.setDate(now.getDate() + diff + offset * 7);
        monday.setHours(0, 0, 0, 0);
        return monday;
    },

    getWeekDays(weekStart) {
        const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);
            days.push({
                dayName: dayNames[i],
                dateStr: d.toISOString().split('T')[0]
            });
        }
        return days;
    },

    getWeekLabel(weekStart) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        const format = (d) => `${d.getMonth() + 1}月${d.getDate()}日`;
        return `${format(weekStart)} - ${format(weekEnd)}`;
    },

    updateBodyData() {
        const height = parseFloat(document.getElementById('bodyHeight').value);
        const weight = parseFloat(document.getElementById('bodyWeight').value);
        if (height && weight) {
            Storage.setBodyData({ height, weight });
            this.renderPage('plan');
        }
    },

    editBodyData() {
        // 简单实现：滚动到身体数据区域
        document.querySelector('.body-form')?.scrollIntoView({ behavior: 'smooth' });
    },

    refreshMealPlan() {
        this.renderPage('plan');
    },

    // ===== 知识页 =====
    renderKnowledge() {
        return `
            <div class="page-header">
                <div class="page-title">知识成长</div>
                <div class="page-subtitle">每天进步一点点，积累大不同</div>
            </div>

            <div class="knowledge-tabs">
                <div class="knowledge-tab ${this.currentKnowledgeTab === 'english' ? 'active' : ''}" onclick="app.switchKnowledgeTab('english')">英语学习</div>
                <div class="knowledge-tab ${this.currentKnowledgeTab === 'reading' ? 'active' : ''}" onclick="app.switchKnowledgeTab('reading')">阅读打卡</div>
                <div class="knowledge-tab ${this.currentKnowledgeTab === 'inspiration' ? 'active' : ''}" onclick="app.switchKnowledgeTab('inspiration')">灵感库</div>
            </div>

            <div id="knowledgeContent">
                ${this.currentKnowledgeTab === 'english' ? this.renderEnglish() : 
                  this.currentKnowledgeTab === 'reading' ? this.renderReading() : 
                  this.renderInspiration()}
            </div>
        `;
    },

    renderEnglish() {
        const data = this.englishData;
        
        return `
            <div class="english-card ${data.ieltsCompleted ? 'completed' : ''}">
                <div class="english-card-header">
                    <div class="english-card-title">📖 每日雅思单词</div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="complete-status">${data.ieltsCompleted ? '已完成' : '15个'}</span>
                        <div class="checkbox ${data.ieltsCompleted ? 'checked' : ''}" onclick="app.toggleEnglishComplete('ielts')"></div>
                    </div>
                </div>
                <div style="font-size: 12px; color: var(--text-light); margin-bottom: 10px;">每日自动更新15个雅思核心词汇</div>
                ${this.ieltsWords.map((word, i) => `
                    <div class="word-item ${word.expanded ? 'expanded' : ''}" onclick="app.toggleWordExpand('ielts', ${i})">
                        <div class="word-main">
                            <span class="word-text">${word.word}</span>
                            <span class="word-phonetic">${word.phonetic}</span>
                        </div>
                        <div class="word-meaning">${word.meaning}</div>
                        <div class="word-detail">例句：${word.example}</div>
                    </div>
                `).join('')}
            </div>

            <div class="english-card ${data.vocabularyCompleted ? 'completed' : ''}">
                <div class="english-card-header">
                    <div class="english-card-title">📝 每日核心词汇</div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="complete-status">${data.vocabularyCompleted ? '已完成' : '10个'}</span>
                        <div class="checkbox ${data.vocabularyCompleted ? 'checked' : ''}" onclick="app.toggleEnglishComplete('vocabulary')"></div>
                    </div>
                </div>
                <div style="font-size: 12px; color: var(--text-light); margin-bottom: 10px;">每日自动更新10个生活实用词汇</div>
                ${this.vocabWords.map((word, i) => `
                    <div class="word-item">
                        <div class="word-main">
                            <span class="word-text">${word.word}</span>
                            <span class="word-phonetic">${word.pos}</span>
                        </div>
                        <div class="word-collocation">${word.collocation}</div>
                    </div>
                `).join('')}
            </div>

            <div class="english-card ${data.dialogueCompleted ? 'completed' : ''}">
                <div class="english-card-header">
                    <div class="english-card-title">💬 日常口语对话</div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="complete-status">${data.dialogueCompleted ? '已完成' : '去学习'}</span>
                        <div class="checkbox ${data.dialogueCompleted ? 'checked' : ''}" onclick="app.toggleEnglishComplete('dialogue')"></div>
                    </div>
                </div>
                <div style="font-size: 12px; color: var(--text-light); margin-bottom: 10px;">每日更新一个生活化场景对话</div>
                <div class="dialogue-scene">🎯 ${this.dialogue.scene}</div>
                ${this.dialogue.lines.map(line => `
                    <div class="dialogue-line speaker-${line.speaker.toLowerCase()}">
                        <div class="speaker">Speaker ${line.speaker}</div>
                        <div class="en-text">${line.en}</div>
                        <div class="zh-text">${line.zh}</div>
                    </div>
                `).join('')}
            </div>

            <div class="refresh-english" onclick="app.refreshEnglish()">🔄 换一批内容</div>
        `;
    },

    renderReading() {
        const records = Storage.getReadingRecords();
        const streak = Storage.getReadingStreak();

        return `
            <div class="reading-streak">
                <div class="streak-number">${streak}</div>
                <div class="streak-text">天连续阅读<br>继续加油！</div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-title"><span class="icon">📚</span>今日阅读打卡</div>
                </div>
                <div class="reading-form">
                    <input type="text" class="input" id="readingBookName" placeholder="输入书籍名称">
                    <div class="form-row">
                        <input type="number" class="input" id="readingDuration" placeholder="阅读时长（分钟）">
                        <input type="number" class="input" id="readingPages" placeholder="阅读页数">
                    </div>
                    <input type="text" class="input" id="readingNote" placeholder="阅读感悟或备注（选填）">
                    <button class="btn btn-primary btn-block" onclick="app.addReadingRecord()">确认打卡</button>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-title"><span class="icon">📖</span>近期阅读记录</div>
                    <div class="card-action">全部 →</div>
                </div>
                ${records.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-icon">📚</div>
                        <div class="empty-text">还没有阅读记录</div>
                        <div class="empty-subtext">开始你的第一本好书吧</div>
                    </div>
                ` : records.slice(0, 7).map(record => `
                    <div class="reading-record-item">
                        <div class="book-icon">📕</div>
                        <div class="record-info">
                            <div class="book-name">${record.bookName}</div>
                            <div class="record-meta">
                                ${record.duration ? `${record.duration}分钟` : ''} 
                                ${record.pages ? ` · ${record.pages}页` : ''}
                                ${record.note ? ` · ${record.note}` : ''}
                            </div>
                        </div>
                        <div class="record-date">${record.date.slice(5)}</div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderInspiration() {
        const categories = ['拼贴排版', '有趣文创', '热门艺术风格'];
        const items = MockData.getInspiration(this.currentInspirationCat);

        return `
            <div class="inspiration-categories">
                ${categories.map(cat => `
                    <div class="inspiration-cat ${cat === this.currentInspirationCat ? 'active' : ''}" onclick="app.switchInspirationCat('${cat}')">${cat}</div>
                `).join('')}
            </div>
            <div class="inspiration-grid">
                ${items.map(item => `
                    <div class="inspiration-card" onclick="window.open('${item.url}', '_blank')">
                        <div class="insp-image">${item.icon}</div>
                        <div class="insp-info">
                            <div class="insp-title">${item.title}</div>
                            <div class="insp-source">
                                <span class="source-label">${item.source}</span>
                                <span class="view-link">查看 →</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    bindKnowledgeEvents() {
        // 事件已通过 onclick 绑定
    },

    switchKnowledgeTab(tab) {
        this.currentKnowledgeTab = tab;
        this.renderPage('knowledge');
    },

    switchInspirationCat(cat) {
        this.currentInspirationCat = cat;
        this.renderKnowledgeContent();
    },

    renderKnowledgeContent() {
        const content = document.getElementById('knowledgeContent');
        if (content) {
            content.innerHTML = this.currentKnowledgeTab === 'english' ? this.renderEnglish() : 
                               this.currentKnowledgeTab === 'reading' ? this.renderReading() : 
                               this.renderInspiration();
        }
    },

    initEnglishData() {
        this.englishData = Storage.getEnglishData();
        this.ieltsWords = MockData.getIeltsWords(15).map(w => ({ ...w, expanded: false }));
        this.vocabWords = MockData.getVocabWords(10);
        this.dialogue = MockData.getDialogue();
    },

    toggleEnglishComplete(type) {
        this.englishData = Storage.toggleEnglish(type);
        this.renderKnowledgeContent();
    },

    toggleWordExpand(type, index) {
        if (type === 'ielts') {
            this.ieltsWords[index].expanded = !this.ieltsWords[index].expanded;
        }
        this.renderKnowledgeContent();
    },

    refreshEnglish() {
        this.ieltsWords = MockData.getIeltsWords(15).map(w => ({ ...w, expanded: false }));
        this.vocabWords = MockData.getVocabWords(10);
        this.dialogue = MockData.getDialogue();
        this.renderKnowledgeContent();
    },

    addReadingRecord() {
        const bookName = document.getElementById('readingBookName').value.trim();
        const duration = document.getElementById('readingDuration').value;
        const pages = document.getElementById('readingPages').value;
        const note = document.getElementById('readingNote').value.trim();

        if (!bookName) {
            alert('请输入书籍名称');
            return;
        }

        Storage.addReading({ bookName, duration, pages, note });
        this.renderKnowledgeContent();
        alert('打卡成功！继续保持～');
    },

    // ===== 记账浮层 =====
    openBillModal() {
        document.getElementById('billModal').classList.add('show');
        this.renderBillCategories();
        this.updateBillSummary();
        document.getElementById('billAmount').value = '';
        document.getElementById('billNote').value = '';
        document.getElementById('billDate').value = new Date().toISOString().split('T')[0];
        this.selectedCategory = null;
    },

    closeBillModal() {
        document.getElementById('billModal').classList.remove('show');
    },

    renderBillCategories() {
        const categories = this.billType === 'expense' ? MockData.expenseCategories : MockData.incomeCategories;
        const container = document.getElementById('billCategories');
        container.innerHTML = categories.map(cat => `
            <div class="category-item ${this.selectedCategory === cat.name ? 'active' : ''}" onclick="app.selectCategory('${cat.name}')">
                <div class="category-icon">${cat.icon}</div>
                <div class="category-name">${cat.name}</div>
            </div>
        `).join('');
    },

    selectCategory(name) {
        this.selectedCategory = name;
        this.renderBillCategories();
    },

    saveBill() {
        const amount = parseFloat(document.getElementById('billAmount').value);
        const date = document.getElementById('billDate').value;
        const note = document.getElementById('billNote').value.trim();

        if (!amount || amount <= 0) {
            alert('请输入正确的金额');
            return;
        }
        if (!this.selectedCategory) {
            alert('请选择分类');
            return;
        }

        const categories = this.billType === 'expense' ? MockData.expenseCategories : MockData.incomeCategories;
        const cat = categories.find(c => c.name === this.selectedCategory);

        Storage.addBill({
            type: this.billType,
            amount,
            category: this.selectedCategory,
            categoryIcon: cat ? cat.icon : '📦',
            date,
            note
        });

        this.closeBillModal();
        this.updateBillSummary();
        
        // 如果在账单详情页，刷新
        if (this.currentPage === 'billDetail') {
            this.renderPage('billDetail');
        }
    },

    updateBillSummary() {
        const now = new Date();
        const summary = Storage.getMonthSummary(now.getFullYear(), now.getMonth());
        const expenseEl = document.getElementById('monthExpense');
        const incomeEl = document.getElementById('monthIncome');
        const balanceEl = document.getElementById('monthBalance');
        
        if (expenseEl) expenseEl.textContent = `¥${summary.expense}`;
        if (incomeEl) incomeEl.textContent = `¥${summary.income}`;
        if (balanceEl) {
            balanceEl.textContent = `¥${summary.balance}`;
            balanceEl.className = `summary-value ${parseFloat(summary.balance) >= 0 ? 'income' : 'expense'}`;
        }
    },

    // ===== 账单详情页 =====
    renderBillDetail() {
        const now = new Date();
        const summary = Storage.getMonthSummary(now.getFullYear(), now.getMonth());
        const bills = Storage.getMonthBills(now.getFullYear(), now.getMonth());
        const settings = Storage.getSettings();
        const budget = settings.monthlyBudget || 3000;
        const expenseNum = parseFloat(summary.expense);
        const budgetPercent = Math.min((expenseNum / budget) * 100, 100);
        const overBudget = expenseNum > budget;

        // 按日期分组
        const grouped = {};
        bills.sort((a, b) => new Date(b.date) - new Date(a.date));
        bills.forEach(bill => {
            if (!grouped[bill.date]) {
                grouped[bill.date] = [];
            }
            grouped[bill.date].push(bill);
        });

        // 计算分类支出
        const catExpense = {};
        bills.filter(b => b.type === 'expense').forEach(b => {
            if (!catExpense[b.category]) {
                catExpense[b.category] = { amount: 0, icon: b.categoryIcon };
            }
            catExpense[b.category].amount += b.amount;
        });
        const topCats = Object.entries(catExpense)
            .sort((a, b) => b[1].amount - a[1].amount)
            .slice(0, 5);

        return `
            <div class="page-header">
                <div class="page-title">记账明细</div>
                <div class="page-subtitle">${now.getFullYear()}年${now.getMonth() + 1}月</div>
            </div>

            <div class="card">
                <div class="body-stats" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="stat-card" style="background: #FFEBEE;">
                        <div class="stat-value" style="color: #F44336;">¥${summary.expense}</div>
                        <div class="stat-label">本月支出</div>
                    </div>
                    <div class="stat-card" style="background: #E8F5E9;">
                        <div class="stat-value" style="color: var(--primary);">¥${summary.income}</div>
                        <div class="stat-label">本月收入</div>
                    </div>
                    <div class="stat-card" style="background: #E3F2FD;">
                        <div class="stat-value" style="color: #2196F3;">¥${summary.balance}</div>
                        <div class="stat-label">结余</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-title"><span class="icon">💰</span>月度预算</div>
                    <div class="card-action" onclick="app.editBudget()">设置</div>
                </div>
                <div class="budget-progress">
                    <div class="budget-progress-bar">
                        <div class="budget-progress-fill ${overBudget ? 'over-budget' : ''}" style="width: ${budgetPercent}%"></div>
                    </div>
                    <div class="budget-text">
                        <span>已使用 ¥${summary.expense}</span>
                        <span class="${overBudget ? 'over-text' : ''}">${overBudget ? '已超支' : `总预算 ¥${budget}`}</span>
                    </div>
                </div>
                <div style="margin-top: 12px;">
                    ${topCats.map(([name, data]) => {
                        const catPercent = Math.min((data.amount / budget) * 100, 100);
                        const catOver = data.amount > budget * 0.3;
                        return `
                            <div class="cat-budget-item">
                                <div class="cat-icon">${data.icon}</div>
                                <div class="cat-info">
                                    <div class="cat-name">${name}</div>
                                    <div class="cat-bar">
                                        <div class="cat-bar-fill ${catOver ? 'over' : ''}" style="width: ${catPercent}%"></div>
                                    </div>
                                </div>
                                <div class="cat-amount ${catOver ? 'over' : ''}">¥${data.amount.toFixed(0)}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-title"><span class="icon">📝</span>账单明细</div>
                    <div class="card-action">共 ${bills.length} 笔</div>
                </div>
                ${bills.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-icon">💳</div>
                        <div class="empty-text">还没有记账记录</div>
                        <div class="empty-subtext">点击底部 ➕ 开始记一笔</div>
                    </div>
                ` : Object.entries(grouped).map(([date, dayBills]) => {
                    const dayTotal = dayBills.reduce((sum, b) => sum + (b.type === 'expense' ? b.amount : -b.amount), 0);
                    return `
                        <div class="bill-date-group">
                            <div class="bill-date-header">
                                <span>${date}</span>
                                <span class="day-total">支出 ¥${dayBills.filter(b => b.type === 'expense').reduce((s, b) => s + b.amount, 0).toFixed(2)}</span>
                            </div>
                            ${dayBills.map(bill => `
                                <div class="bill-item">
                                    <div class="bill-cat-icon">${bill.categoryIcon}</div>
                                    <div class="bill-info">
                                        <div class="bill-cat-name">${bill.category}</div>
                                        ${bill.note ? `<div class="bill-note-text">${bill.note}</div>` : ''}
                                    </div>
                                    <div class="bill-amount-text ${bill.type}">
                                        ${bill.type === 'expense' ? '-' : '+'}¥${bill.amount.toFixed(2)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    bindBillDetailEvents() {
        // 事件已通过 onclick 绑定
    },

    editBudget() {
        const settings = Storage.getSettings();
        const newBudget = prompt('设置月度预算（元）：', settings.monthlyBudget);
        if (newBudget && !isNaN(newBudget)) {
            Storage.setSettings({ monthlyBudget: parseFloat(newBudget) });
            this.renderPage('billDetail');
        }
    },

    // ===== 我的页面 =====
    renderProfile() {
        const settings = Storage.getSettings();
        const plans = Storage.getPlans();
        const bills = Storage.getBills();
        const reading = Storage.getReadingRecords();
        const streak = Storage.getReadingStreak();
        
        const completedPlans = plans.filter(p => p.completed).length;

        return `
            <div class="profile-header">
                <div class="profile-avatar">${settings.avatar}</div>
                <div class="profile-info">
                    <div class="profile-name">${settings.nickname}</div>
                    <div class="profile-desc">🌱 持续成长中 · 第 ${this.getDaysSinceFirstUse()} 天</div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number">${completedPlans}</div>
                    <div class="stat-label">完成任务</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${streak}</div>
                    <div class="stat-label">连续阅读</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${bills.length}</div>
                    <div class="stat-label">记账笔数</div>
                </div>
            </div>

            <div class="settings-section">
                <div class="settings-title">个人设置</div>
                <div class="settings-list">
                    <div class="settings-item" onclick="app.openProfileSettings()">
                        <div class="settings-icon">👤</div>
                        <div class="settings-text">个人信息</div>
                        <div class="settings-value">${settings.nickname}</div>
                        <div class="settings-arrow">›</div>
                    </div>
                    <div class="settings-item" onclick="app.openBodySettings()">
                        <div class="settings-icon">📏</div>
                        <div class="settings-text">身形档案</div>
                        <div class="settings-value">${settings.bodyType === 'average' ? '标准' : settings.bodyType}</div>
                        <div class="settings-arrow">›</div>
                    </div>
                    <div class="settings-item" onclick="app.openStyleSettings()">
                        <div class="settings-icon">👗</div>
                        <div class="settings-text">穿搭偏好</div>
                        <div class="settings-value">${settings.stylePreference}</div>
                        <div class="settings-arrow">›</div>
                    </div>
                    <div class="settings-item" onclick="app.editBudget()">
                        <div class="settings-icon">💰</div>
                        <div class="settings-text">月度预算</div>
                        <div class="settings-value">¥${settings.monthlyBudget}</div>
                        <div class="settings-arrow">›</div>
                    </div>
                </div>
            </div>

            <div class="settings-section">
                <div class="settings-title">数据管理</div>
                <div class="settings-list">
                    <div class="settings-item" onclick="app.exportData()">
                        <div class="settings-icon">📤</div>
                        <div class="settings-text">导出数据</div>
                        <div class="settings-value">JSON</div>
                        <div class="settings-arrow">›</div>
                    </div>
                    <div class="settings-item" onclick="app.clearData()">
                        <div class="settings-icon">🗑️</div>
                        <div class="settings-text">清空数据</div>
                        <div class="settings-value" style="color: #F44336;">危险操作</div>
                        <div class="settings-arrow">›</div>
                    </div>
                </div>
            </div>

            <div class="settings-section">
                <div class="settings-title">关于</div>
                <div class="settings-list">
                    <div class="settings-item">
                        <div class="settings-icon">🌱</div>
                        <div class="settings-text">个人成长工作台</div>
                        <div class="settings-value">v1.0.0</div>
                    </div>
                    <div class="settings-item" onclick="window.open('https://github.com/guhijames3781-art', '_blank')">
                        <div class="settings-icon">🐙</div>
                        <div class="settings-text">GitHub 仓库</div>
                        <div class="settings-value">guhijames3781-art</div>
                        <div class="settings-arrow">›</div>
                    </div>
                </div>
            </div>

            <!-- 设置弹窗 -->
            <div class="settings-modal" id="settingsModal">
                <div class="settings-modal-content">
                    <h3 id="settingsModalTitle">设置</h3>
                    <div id="settingsModalBody"></div>
                    <div class="settings-modal-actions">
                        <button class="btn btn-outline" onclick="app.closeSettingsModal()">取消</button>
                        <button class="btn btn-primary" onclick="app.saveSettings()">保存</button>
                    </div>
                </div>
            </div>
        `;
    },

    bindProfileEvents() {
        // 事件已通过 onclick 绑定
    },

    openProfileSettings() {
        const settings = Storage.getSettings();
        document.getElementById('settingsModalTitle').textContent = '个人信息';
        document.getElementById('settingsModalBody').innerHTML = `
            <div class="settings-form-group">
                <label>昵称</label>
                <input type="text" id="settingNickname" value="${settings.nickname}">
            </div>
            <div class="settings-form-group">
                <label>头像表情</label>
                <input type="text" id="settingAvatar" value="${settings.avatar}" placeholder="输入一个emoji">
            </div>
        `;
        document.getElementById('settingsModal').classList.add('show');
        this.currentSettingType = 'profile';
    },

    openBodySettings() {
        const settings = Storage.getSettings();
        const body = Storage.getBodyData();
        document.getElementById('settingsModalTitle').textContent = '身形档案';
        document.getElementById('settingsModalBody').innerHTML = `
            <div class="settings-form-group">
                <label>身高 (cm)</label>
                <input type="number" id="settingHeight" value="${body.height}">
            </div>
            <div class="settings-form-group">
                <label>体重 (kg)</label>
                <input type="number" id="settingWeight" value="${body.weight}">
            </div>
            <div class="settings-form-group">
                <label>身形类型</label>
                <select id="settingBodyType">
                    <option value="slim" ${settings.bodyType === 'slim' ? 'selected' : ''}>偏瘦</option>
                    <option value="average" ${settings.bodyType === 'average' ? 'selected' : ''}>标准</option>
                    <option value="pear" ${settings.bodyType === 'pear' ? 'selected' : ''}>梨形</option>
                    <option value="apple" ${settings.bodyType === 'apple' ? 'selected' : ''}>苹果形</option>
                </select>
            </div>
            <div class="settings-form-group">
                <label>肤色</label>
                <select id="settingSkinTone">
                    <option value="warm" ${settings.skinTone === 'warm' ? 'selected' : ''}>暖皮</option>
                    <option value="neutral" ${settings.skinTone === 'neutral' ? 'selected' : ''}>中性皮</option>
                    <option value="cool" ${settings.skinTone === 'cool' ? 'selected' : ''}>冷皮</option>
                </select>
            </div>
        `;
        document.getElementById('settingsModal').classList.add('show');
        this.currentSettingType = 'body';
    },

    openStyleSettings() {
        const settings = Storage.getSettings();
        document.getElementById('settingsModalTitle').textContent = '穿搭偏好';
        document.getElementById('settingsModalBody').innerHTML = `
            <div class="settings-form-group">
                <label>偏好风格</label>
                <select id="settingStyle">
                    <option value="通勤" ${settings.stylePreference === '通勤' ? 'selected' : ''}>通勤风</option>
                    <option value="休闲" ${settings.stylePreference === '休闲' ? 'selected' : ''}>休闲风</option>
                    <option value="甜酷" ${settings.stylePreference === '甜酷' ? 'selected' : ''}>甜酷风</option>
                    <option value="温柔" ${settings.stylePreference === '温柔' ? 'selected' : ''}>温柔风</option>
                    <option value="日系" ${settings.stylePreference === '日系' ? 'selected' : ''}>日系</option>
                </select>
            </div>
            <div class="settings-form-group">
                <label>当前季节</label>
                <select id="settingSeason">
                    <option value="spring" ${settings.season === 'spring' ? 'selected' : ''}>春季</option>
                    <option value="summer" ${settings.season === 'summer' ? 'selected' : ''}>夏季</option>
                    <option value="autumn" ${settings.season === 'autumn' ? 'selected' : ''}>秋季</option>
                    <option value="winter" ${settings.season === 'winter' ? 'selected' : ''}>冬季</option>
                </select>
            </div>
        `;
        document.getElementById('settingsModal').classList.add('show');
        this.currentSettingType = 'style';
    },

    closeSettingsModal() {
        document.getElementById('settingsModal').classList.remove('show');
    },

    saveSettings() {
        const settings = Storage.getSettings();
        
        if (this.currentSettingType === 'profile') {
            settings.nickname = document.getElementById('settingNickname').value || '成长中的你';
            settings.avatar = document.getElementById('settingAvatar').value || '🌱';
        } else if (this.currentSettingType === 'body') {
            const height = parseFloat(document.getElementById('settingHeight').value);
            const weight = parseFloat(document.getElementById('settingWeight').value);
            const bodyType = document.getElementById('settingBodyType').value;
            const skinTone = document.getElementById('settingSkinTone').value;
            settings.bodyType = bodyType;
            settings.skinTone = skinTone;
            Storage.setBodyData({ height, weight });
        } else if (this.currentSettingType === 'style') {
            settings.stylePreference = document.getElementById('settingStyle').value;
            settings.season = document.getElementById('settingSeason').value;
        }
        
        Storage.setSettings(settings);
        this.closeSettingsModal();
        this.renderPage('profile');
    },

    exportData() {
        const data = Storage.exportAll();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `workbench-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    clearData() {
        if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
            if (confirm('再次确认：真的要删除所有数据吗？')) {
                Storage.clearAll();
                alert('数据已清空，页面即将刷新');
                location.reload();
            }
        }
    },

    getDaysSinceFirstUse() {
        // 简单计算：用第一条记录的日期到今天的天数
        const plans = Storage.getPlans();
        const bills = Storage.getBills();
        const reading = Storage.getReadingRecords();
        
        const allDates = [
            ...plans.map(p => p.createdAt),
            ...bills.map(b => b.createdAt),
            ...reading.map(r => r.createdAt)
        ];
        
        if (allDates.length === 0) return 1;
        
        const firstDate = new Date(Math.min(...allDates.map(d => new Date(d).getTime())));
        const today = new Date();
        const diffDays = Math.floor((today - firstDate) / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    },

    // ===== 工具方法 =====
    formatDate(date) {
        const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekDay = weekDays[date.getDay()];
        return `${month}月${day}日 ${weekDay}`;
    }
};

// 启动应用
const app = App;
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
