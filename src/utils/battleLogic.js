export function simulateBattle(p1, p2) {
    const statsToCompare = ["hp", "attack", "speed"];
    let p1Score = 0;
    let p2Score = 0;
  
    statsToCompare.forEach((stat) => {
      const p1Stat = p1.stats.find((s) => s.stat.name === stat).base_stat;
      const p2Stat = p2.stats.find((s) => s.stat.name === stat).base_stat;
  
      if (p1Stat > p2Stat) p1Score++;
      else if (p2Stat > p1Stat) p2Score++;
    });
  
    return p1Score >= 2 ? p1.name : p2.name;
  }
  