import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const gameRouter = createTRPCRouter({
  // 保持原有的查询方法
  getAttributes: publicProcedure.query(async () => {
    return [
      { id: 'str', name: '力量', value: 5, min: 3, max: 9 },
      { id: 'dex', name: '敏捷', value: 5, min: 3, max: 9 },
      { id: 'int', name: '智力', value: 5, min: 3, max: 9 },
      { id: 'vit', name: '体质', value: 5, min: 3, max: 9 },
    ];
  }),

  getTalents: publicProcedure.query(async () => {
    return [
      // SSS级天赋 (6个)
      {
        id: 'free_wanderer',
        name: '逍遥游',
        rank: 'SSS',
        description: '刚开始获取绝对闪避，每场战斗只能用2次，用100次时获得坐骑灵鲲，200次时获得技能击水三千。闪避率锁定80',
        effect: '开始加1000脚力，如无宗门再加500'
      },
      {
        id: 'mysterious_visitor',
        name: '神秘来客',
        rank: 'SSS',
        description: '偶尔能听到一些绝密的消息，在每个月结束有50%概率获得一些提示',
        effect: '得到一些有用的藏宝线索'
      },
      {
        id: 'drunken_blade',
        name: '醉饮狂刀',
        rank: 'SSS',
        description: '对任何刀的熟练度锁定到100，所有刀攻击力乘自己的等级 并获得醉饮狂刀技能',
        effect: '战斗中积累"刀意值"，满值时触发"刀意爆发"造成巨额伤害'
      },
      {
        id: 'child_of_stars',
        name: '星辰之子',
        rank: 'SSS',
        description: '初始时获得一项随机高级法术技能，且所有法术技能伤害提升20%。每升一级，随机获得一点属性加成',
        effect: '夜晚战斗时，所有属性提升15%'
      },
      {
        id: 'shadow_walker',
        name: '暗影行者',
        rank: 'SSS',
        description: '初始即拥有隐身技能，每场战斗可无限次使用，使用一次隐身3回合。但每次使用需消耗30%内力',
        effect: '隐身状态攻击力翻倍，20%概率避免遭遇战斗'
      },
      {
        id: 'phoenix_wings',
        name: '不死鸟之翼',
        rank: 'SSS',
        description: '每次战斗结束后，自动恢复20%的生命值和内力。当生命值低于10%时，触发一次不死效果',
        effect: '火焰环境中恢复速度加倍'
      },
  
      // SS级天赋 (5个)
      {
        id: 'masochist_ss',
        name: '受虐狂',
        rank: 'SS',
        description: '生命值每降低10%，攻击力提升20%，直至达到最大提升上限',
        effect: ''
      },
      {
        id: 'reincarnated_great_one',
        name: '大能转世',
        rank: 'SS',
        description: '开局获得一个有器灵的法宝',
        effect: '无级别法宝出生就能使用'
      },
      {
        id: 'turtle_god',
        name: '龟神',
        rank: 'SS',
        description: '防御锁定到80，速度锁定到10，逃跑必定失败',
        effect: '反弹20%的物理和法术伤害'
      },
      {
        id: 'dragon_heir',
        name: '龙脉传人',
        rank: 'SS',
        description: '开局即获得一项与龙相关的特殊技能，并额外获得一次复活机会',
        effect: '龙脉之地战斗时属性提升25%'
      },
      {
        id: 'thief_god',
        name: '神偷',
        rank: 'SS',
        description: '偷东西100%成功',
        effect: ''
      },
  
      // S级天赋 (1个)
      {
        id: 'elemental_disciple',
        name: '元素使徒',
        rank: 'S',
        description: '对所有元素系法术的熟练度锁定为100%，且施放元素法术时消耗降低20%',
        effect: '元素浓郁地区伤害提升50%'
      },
  
      // A级天赋 (2个)
      {
        id: 'mechanic_master',
        name: '机关大师',
        rank: 'A',
        description: '初始即掌握制造和修理机关的技巧，可制作各种机关陷阱和辅助道具',
        effect: '机关环境中陷阱效果提升50%'
      },
      {
        id: 'smart_bald',
        name: '聪明谢顶',
        rank: 'A',
        description: '悟性锁定到90，魅力锁定到0',
        effect: '10%概率发现隐藏地图'
      },
  
      // B级天赋 (3个)
      {
        id: 'medicine_heir',
        name: '药王传人',
        rank: 'B',
        description: '对所有草药和毒药的识别率提升为100%，且制作药品的成功率提升50%',
        effect: '可发现稀有药材'
      },
      {
        id: 'iron_wall',
        name: '铁壁铜墙',
        rank: 'B',
        description: '防御力锁定为当前等级的两倍，且受到的物理伤害降低30%',
        effect: '建筑物附近防御额外提升20%'
      },
      {
        id: 'masochist_b',
        name: '受虐人',
        rank: 'B',
        description: '生命值每降低10%，攻击力提升5%，直至达到最大提升上限',
        effect: ''
      },
  
      // C级天赋 (2个)
      {
        id: 'swift_as_wind',
        name: '迅捷如风',
        rank: 'C',
        description: '速度锁定为当前等级的两倍，且移动速度不受地形影响',
        effect: '开阔地带速度提升15%'
      },
      {
        id: 'spiritual_mentor',
        name: '心灵导师',
        rank: 'C',
        description: '初始即掌握一种治疗技能，且治疗效果提升30%',
        effect: '神圣场所治疗效果加倍'
      },
  
      // D级和E级天赋 (各1个)
      {
        id: 'missing_one',
        name: '缺一门',
        rank: 'D',
        description: '无特殊效果',
        effect: ''
      },
      {
        id: 'sickly',
        name: '体弱多病',
        rank: 'E',
        description: '每次升级获得的气血减半',
        effect: ''
      }
    ];
  }),

  getStartingLocations: publicProcedure.query(async () => {
    return [
      { id: 'village', name: '宁静村庄', description: '和平的开始，适合新手' },
      { id: 'forest', name: '迷雾森林', description: '初期资源丰富但危险' },
      { id: 'desert', name: '荒芜沙漠', description: '艰难的开始，后期回报高' },
    ];
  }),

  // 新增创建角色方法
  createCharacter: publicProcedure
    .input(
      z.object({
        name: z.string().min(2).max(16),
        strength: z.number().min(3).max(9),
        agility: z.number().min(3).max(9),
        intelligence: z.number().min(3).max(9),
        stamina: z.number().min(3).max(9),
        selectedTalents: z.array(z.string()).max(2),
        startingLocation: z.string(),
        difficulty: z.enum(["EASY", "NORMAL", "HARD"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 计算总属性点数
      const totalPoints = input.strength + input.agility + 
                         input.intelligence + input.stamina;
      
      // 验证总点数 (初始20点，4个属性各5点)
      if (totalPoints !== 20) {
        throw new Error("属性点数总和必须等于20");
      }

      return ctx.db.character.create({
        data: {
          ...input,
          selectedTalents: JSON.stringify(input.selectedTalents), // 序列化为JSON
        },
      });
    }),
});