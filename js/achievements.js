(function(){
  const STORAGE_KEY = 'achievements-state-v1';
  const DEFAULT = {
    unlocked: { firstGame: false, score100: false, play5: false },
    progress: { gamesPlayed: 0, totalScore: 0 }
  };
  let state = JSON.parse(JSON.stringify(DEFAULT));

  function load(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        state.unlocked = obj.unlocked || DEFAULT.unlocked;
        state.progress = obj.progress || DEFAULT.progress;
      }
    } catch(e) { state = JSON.parse(JSON.stringify(DEFAULT)); }
  }
  function save(){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e){}
  }

  function render(){
    const list = document.getElementById('achievementsList');
    if(!list) return;
    list.innerHTML = '';
    const items = [
      { id:'firstGame', title:'首次遊戲', desc:'完成第一局遊戲', unlocked: !!state.unlocked.firstGame },
      { id:'score100', title:'單場達成 100 分', desc:'累積分數達到 100', unlocked: !!state.unlocked.score100 },
      { id:'play5', title:'連玩 5 場', desc:'連續遊玩 5 次', unlocked: !!state.unlocked.play5 }
    ];
    items.forEach(it => {
      const div = document.createElement('div');
      div.style.padding = '6px 0';
      div.textContent = `${it.title} - ${it.unlocked ? '已解鎖' : '待解鎖'} (${it.desc})`;
      list.appendChild(div);
    });
  }

  window.Achievements = {
    init(){
      load();
      // ensure keys exist
      if (typeof state.unlocked.firstGame !== 'boolean') state.unlocked.firstGame = false;
      if (typeof state.unlocked.score100 !== 'boolean') state.unlocked.score100 = false;
      if (typeof state.unlocked.play5 !== 'boolean') state.unlocked.play5 = false;
      if (typeof state.progress.gamesPlayed !== 'number') state.progress.gamesPlayed = 0;
      if (typeof state.progress.totalScore !== 'number') state.progress.totalScore = 0;
      save();
      render();
    },
    unlock(id){ if (!state.unlocked[id]) { state.unlocked[id] = true; save(); render(); } },
    incrementGames(){
      state.progress.gamesPlayed = (state.progress.gamesPlayed || 0) + 1;
      if (!state.unlocked.firstGame && state.progress.gamesPlayed >= 1) this.unlock('firstGame');
      if (!state.unlocked.play5 && state.progress.gamesPlayed >= 5) this.unlock('play5');
      save(); render();
    },
    setScoreTotal(total){
      state.progress.totalScore = total || 0;
      if (!state.unlocked.score100 && state.progress.totalScore >= 100) this.unlock('score100');
      save(); render();
    },
    addScoreDelta(delta){
      this.setScoreTotal((state.progress.totalScore || 0) + (delta || 0));
    },
    getList(){ return state.unlocked; }
  };
})();
