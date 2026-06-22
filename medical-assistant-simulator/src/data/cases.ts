import { Case } from '../types';

export const cases: Case[] = [
  {
    id: 'double-eyelid',
    name: '双眼皮成形术',
    category: '眼部整形',
    difficulty: 'medium',
    duration: 45,
    description: '模拟全切双眼皮手术全程配合，包括术前准备、无菌操作、器械传递和术后宣教',
    icon: 'Eye',
    steps: [
      {
        id: 'de-1',
        order: 1,
        name: '顾客身份确认',
        description: '核对顾客姓名、年龄、手术同意书、过敏史等关键信息',
        category: 'identity',
        duration: 3,
        requiredItems: ['手术同意书', '身份核对表', '过敏史记录'],
        keyInputs: [
          { id: 'de-1-name', label: '顾客姓名', type: 'text', required: true, placeholder: '请输入顾客姓名' },
          { id: 'de-1-id', label: '病历号', type: 'text', required: true, placeholder: '请输入病历号', validator: { pattern: '^[A-Z]\\d{6}$', message: '病历号格式：大写字母+6位数字' } }
        ],
        correctActions: ['主动问候顾客', '核对姓名、生日', '查看手术同意书签字', '询问过敏史'],
        wrongActions: [
          { id: 'de-1-w1', action: '跳过身份核对直接开始', risk: '可能导致做错顾客或部位，属于严重医疗差错', riskLevel: 'high', deduction: 15 },
          { id: 'de-1-w2', action: '未询问过敏史', risk: '术中可能发生过敏反应无法及时处理', riskLevel: 'medium', deduction: 10 }
        ]
      },
      {
        id: 'de-2',
        order: 2,
        name: '物品摆台准备',
        description: '按无菌原则摆放手术器械、耗材和药品',
        category: 'preparation',
        duration: 5,
        requiredItems: ['眼科剪', '整形镊', '持针器', '缝合线', '利多卡因', '肾上腺素', '无菌纱布', '碘伏', '生理盐水'],
        keyInputs: [
          { id: 'de-2-lot', label: '利多卡因批号', type: 'text', required: true, placeholder: '请输入麻药批号', validator: { pattern: '^\\d{8}$', message: '批号为8位数字' } }
        ],
        correctActions: ['检查无菌包有效期', '按使用顺序摆放器械', '核对药品名称和有效期', '准备急救物品'],
        wrongActions: [
          { id: 'de-2-w1', action: '使用过期无菌包', risk: '可能导致手术部位感染', riskLevel: 'high', deduction: 15 },
          { id: 'de-2-w2', action: '器械摆放混乱影响取用', risk: '延长手术时间，增加感染风险', riskLevel: 'low', deduction: 5 }
        ]
      },
      {
        id: 'de-3',
        order: 3,
        name: '无菌配合',
        description: '协助消毒、铺巾，保持无菌区域',
        category: 'asepsis',
        duration: 5,
        requiredItems: ['碘伏棉球', '无菌洞巾', '无菌手套', '手术衣'],
        correctActions: ['倒碘伏时注意无菌操作', '传递无菌物品时不跨越无菌区', '及时补充无菌物品', '监督无菌操作执行'],
        wrongActions: [
          { id: 'de-3-w1', action: '跨越无菌区传递物品', risk: '污染无菌区，增加感染风险', riskLevel: 'high', deduction: 15 },
          { id: 'de-3-w2', action: '碘伏浸湿铺巾未及时更换', risk: '潮湿可导致细菌穿透', riskLevel: 'medium', deduction: 10 }
        ]
      },
      {
        id: 'de-4',
        order: 4,
        name: '器械传递配合',
        description: '根据医生口令准确传递手术器械',
        category: 'delivery',
        duration: 20,
        commands: ['de-c-1', 'de-c-2', 'de-c-3', 'de-c-4', 'de-c-5'],
        correctActions: ['器械传递时尖端朝向自己', '传递前确认器械完好', '及时收回用过的器械', '保持术野清晰'],
        wrongActions: [
          { id: 'de-4-w1', action: '传递错误器械', risk: '影响手术节奏，可能误伤组织', riskLevel: 'medium', deduction: 10 },
          { id: 'de-4-w2', action: '器械尖端朝向医生传递', risk: '可能刺伤医生', riskLevel: 'medium', deduction: 10 }
        ]
      },
      {
        id: 'de-5',
        order: 5,
        name: '手术记录',
        description: '准确记录手术过程、用药情况和顾客反应',
        category: 'recording',
        duration: 5,
        keyInputs: [
          { id: 'de-5-medicine', label: '麻醉用药剂量', type: 'text', required: true, placeholder: '如：2%利多卡因2ml' },
          { id: 'de-5-bleeding', label: '出血量(ml)', type: 'number', required: true, placeholder: '请输入出血量' }
        ],
        correctActions: ['实时记录手术步骤', '记录用药名称和剂量', '记录顾客生命体征', '术后及时完成记录'],
        wrongActions: [
          { id: 'de-5-w1', action: '记录不完整，遗漏关键步骤', risk: '影响后续诊疗和法律举证', riskLevel: 'high', deduction: 15 },
          { id: 'de-5-w2', action: '术后补记，回忆有误', risk: '记录不准确，医疗文书质量差', riskLevel: 'medium', deduction: 10 }
        ]
      },
      {
        id: 'de-6',
        order: 6,
        name: '术后宣教',
        description: '向顾客详细说明术后注意事项、用药指导和复诊安排',
        category: 'education',
        duration: 5,
        keyInputs: [
          { id: 'de-6-observation', label: '术后留观时长(分钟)', type: 'number', required: true, placeholder: '建议留观30分钟' },
          { id: 'de-6-followup', label: '复诊日期', type: 'date', required: true }
        ],
        correctActions: ['讲解冰敷方法', '说明拆线时间', '告知异常情况处理', '发放宣教手册'],
        wrongActions: [
          { id: 'de-6-w1', action: '未告知复诊时间', risk: '顾客可能错过拆线和复查', riskLevel: 'medium', deduction: 10 },
          { id: 'de-6-w2', action: '宣教内容不完整', risk: '顾客护理不当影响效果', riskLevel: 'low', deduction: 5 }
        ]
      }
    ],
    commands: [
      {
        id: 'de-c-1',
        stepId: 'de-4',
        content: '来一把11号刀片',
        timeLimit: 5,
        correctAction: '传递11号刀片',
        options: [
          { id: 'de-c-1-o1', text: '传递11号刀片，尖端朝向自己', isCorrect: true, feedback: '正确！刀片传递时尖端应朝向自己，避免误伤医生' },
          { id: 'de-c-1-o2', text: '传递15号刀片', isCorrect: false, feedback: '错误，医生需要的是11号刀片。11号用于切开，15号用于修形', risk: '传递错误器械会影响手术进度' },
          { id: 'de-c-1-o3', text: '传递眼科剪', isCorrect: false, feedback: '错误，此时需要的是刀片而非剪刀' },
          { id: 'de-c-1-o4', text: '询问医生要什么型号', isCorrect: false, feedback: '错误，应能预判医生需求，有疑问时才询问' }
        ],
        riskLevel: 'medium'
      },
      {
        id: 'de-c-2',
        stepId: 'de-4',
        content: '止血',
        timeLimit: 3,
        correctAction: '传递止血钳和肾上腺素棉球',
        options: [
          { id: 'de-c-2-o1', text: '立即传递止血钳和肾上腺素棉球', isCorrect: true, feedback: '正确！止血要迅速，同时准备止血材料' },
          { id: 'de-c-2-o2', text: '先询问出血部位', isCorrect: false, feedback: '错误，出血时应立即行动，不能耽误时间', risk: '延误止血可能增加出血量' },
          { id: 'de-c-2-o3', text: '传递生理盐水冲洗', isCorrect: false, feedback: '错误，冲洗不能止血，应先止血再冲洗' },
          { id: 'de-c-2-o4', text: '等待医生自己处理', isCorrect: false, feedback: '错误，医助应主动配合止血' }
        ],
        riskLevel: 'high'
      },
      {
        id: 'de-c-3',
        stepId: 'de-4',
        content: '来有齿镊',
        timeLimit: 4,
        correctAction: '传递有齿整形镊',
        options: [
          { id: 'de-c-3-o1', text: '传递有齿整形镊', isCorrect: true, feedback: '正确！有齿镊用于夹持较厚组织' },
          { id: 'de-c-3-o2', text: '传递无齿整形镊', isCorrect: false, feedback: '错误，无齿镊用于精细操作，夹持力较弱', risk: '器械使用不当可能影响操作' },
          { id: 'de-c-3-o3', text: '传递止血钳', isCorrect: false, feedback: '错误，止血钳不能替代镊子的功能' },
          { id: 'de-c-3-o4', text: '先确认要哪种镊子', isCorrect: false, feedback: '错误，"有齿镊"已经明确指示' }
        ],
        riskLevel: 'low'
      },
      {
        id: 'de-c-4',
        stepId: 'de-4',
        content: '7-0缝线',
        timeLimit: 5,
        correctAction: '准备7-0缝线和持针器',
        options: [
          { id: 'de-c-4-o1', text: '穿好7-0缝线，装好持针器传递', isCorrect: true, feedback: '正确！术前应准备好缝线，穿好后传递' },
          { id: 'de-c-4-o2', text: '直接把线和针递给医生', isCorrect: false, feedback: '错误，应由医助穿好线装好持针器' },
          { id: 'de-c-4-o3', text: '询问要什么规格的针', isCorrect: false, feedback: '错误，7-0双眼皮缝合通常用角针，应提前准备' },
          { id: 'de-c-4-o4', text: '6-0可以吗？7-0没有了', isCorrect: false, feedback: '错误，术前应检查所有耗材是否齐全' }
        ],
        riskLevel: 'medium'
      },
      {
        id: 'de-c-5',
        stepId: 'de-4',
        content: '眼睛有点干',
        timeLimit: 4,
        correctAction: '滴入人工泪液',
        options: [
          { id: 'de-c-5-o1', text: '滴入准备好的人工泪液', isCorrect: true, feedback: '正确！长时间手术眼睛会干，应准备人工泪液' },
          { id: 'de-c-5-o2', text: '用生理盐水冲洗', isCorrect: false, feedback: '错误，生理盐水不能替代人工泪液的作用' },
          { id: 'de-c-5-o3', text: '让顾客眨眼', isCorrect: false, feedback: '错误，顾客麻醉后无法自如眨眼' },
          { id: 'de-c-5-o4', text: '暂停手术休息', isCorrect: false, feedback: '错误，应及时处理而不是暂停手术' }
        ],
        riskLevel: 'low'
      }
    ],
    risks: [
      { id: 'de-r1', type: 'missing_check', message: '未核对顾客身份！可能造成严重医疗事故', riskLevel: 'critical', relatedStep: 'de-1' },
      { id: 'de-r2', type: 'wrong_item', message: '使用过期无菌物品！感染风险极高', riskLevel: 'high', relatedStep: 'de-2' },
      { id: 'de-r3', type: 'incomplete_record', message: '手术记录不完整！请补充关键信息', riskLevel: 'medium', relatedStep: 'de-5' }
    ]
  },
  {
    id: 'rhinoplasty',
    name: '隆鼻术',
    category: '鼻部整形',
    difficulty: 'hard',
    duration: 60,
    description: '模拟硅胶假体隆鼻手术配合，包括假体雕刻、鼻部分离和假体植入',
    icon: 'Nose',
    steps: [
      {
        id: 'rp-1',
        order: 1,
        name: '顾客身份确认',
        description: '核对顾客信息、手术方案和术前照片',
        category: 'identity',
        duration: 3,
        requiredItems: ['手术同意书', '术前照片', '假体确认单'],
        keyInputs: [
          { id: 'rp-1-name', label: '顾客姓名', type: 'text', required: true },
          { id: 'rp-1-prosthesis', label: '假体型号', type: 'select', options: ['L型2mm', 'L型3mm', '柳叶型2mm', '柳叶型3mm'], required: true }
        ],
        correctActions: ['核对姓名和手术部位', '确认假体型号', '查看术前照片', '确认顾客无感冒流涕'],
        wrongActions: [
          { id: 'rp-1-w1', action: '未确认假体型号', risk: '可能使用错误型号假体，影响手术效果', riskLevel: 'high', deduction: 15 }
        ]
      },
      {
        id: 'rp-2',
        order: 2,
        name: '物品摆台准备',
        description: '准备鼻部整形特殊器械和假体材料',
        category: 'preparation',
        duration: 7,
        requiredItems: ['鼻剥离子', '假体雕刻刀', '假体剪刀', '量规', '硅胶假体', '利多卡因', '碘伏', '生理盐水', '抗生素软膏'],
        keyInputs: [
          { id: 'rp-2-lot', label: '假体批号', type: 'text', required: true, placeholder: '请输入假体外包装批号' },
          { id: 'rp-2-expiry', label: '假体有效期', type: 'date', required: true }
        ],
        correctActions: ['准备多种型号假体备用', '检查假体包装完整性', '准备雕刻器械', '准备骨膜剥离器'],
        wrongActions: [
          { id: 'rp-2-w1', action: '只准备一个型号假体', risk: '术中发现型号不合适时无法更换', riskLevel: 'high', deduction: 15 },
          { id: 'rp-2-w2', action: '假体外包装已破损仍使用', risk: '假体可能已污染，增加感染风险', riskLevel: 'high', deduction: 15 }
        ]
      },
      {
        id: 'rp-3',
        order: 3,
        name: '无菌配合',
        description: '鼻部消毒铺巾，特别注意鼻孔内消毒',
        category: 'asepsis',
        duration: 5,
        requiredItems: ['碘伏棉球', '鼻腔消毒液', '无菌铺巾', '鼻毛修剪器'],
        correctActions: ['修剪鼻毛（如需要）', '鼻腔内充分消毒', '正确铺置无菌洞巾', '准备无菌生理盐水冲洗鼻腔'],
        wrongActions: [
          { id: 'rp-3-w1', action: '鼻腔消毒不彻底', risk: '鼻腔细菌可能导致假体感染', riskLevel: 'high', deduction: 15 },
          { id: 'rp-3-w2', action: '未修剪过长鼻毛', risk: '鼻毛可能掉入术野，增加感染风险', riskLevel: 'medium', deduction: 10 }
        ]
      },
      {
        id: 'rp-4',
        order: 4,
        name: '假体雕刻配合',
        description: '配合医生测量和雕刻假体',
        category: 'delivery',
        duration: 15,
        commands: ['rp-c-1', 'rp-c-2', 'rp-c-3'],
        correctActions: ['测量鼻部参数', '传递雕刻工具', '用生理盐水清洗雕刻好的假体', '假体雕刻完成后抗生素盐水浸泡'],
        wrongActions: [
          { id: 'rp-4-w1', action: '假体雕刻后未清洗就植入', risk: '雕刻碎屑残留体内可能引起异物反应', riskLevel: 'high', deduction: 15 }
        ]
      },
      {
        id: 'rp-5',
        order: 5,
        name: '手术操作配合',
        description: '配合分离腔隙和假体植入',
        category: 'delivery',
        duration: 20,
        commands: ['rp-c-4', 'rp-c-5', 'rp-c-6', 'rp-c-7'],
        correctActions: ['及时止血', '拉钩暴露术野', '检查假体位置', '准备固定缝线'],
        wrongActions: [
          { id: 'rp-5-w1', action: '拉钩用力过大损伤组织', risk: '可能损伤重要血管神经', riskLevel: 'high', deduction: 15 },
          { id: 'rp-5-w2', action: '未及时止血', risk: '形成血肿影响假体位置', riskLevel: 'medium', deduction: 10 }
        ]
      },
      {
        id: 'rp-6',
        order: 6,
        name: '手术记录',
        description: '详细记录假体信息和手术过程',
        category: 'recording',
        duration: 5,
        keyInputs: [
          { id: 'rp-6-implant', label: '植入假体品牌型号', type: 'text', required: true, placeholder: '如：韩式生科L型3mm' },
          { id: 'rp-6-blood', label: '出血量(ml)', type: 'number', required: true }
        ],
        correctActions: ['粘贴假体条形码', '记录雕刻过程', '记录植入层次', '记录术中并发症（如有）'],
        wrongActions: [
          { id: 'rp-6-w1', action: '未粘贴假体条形码', risk: '无法追溯假体来源，出现问题无法举证', riskLevel: 'high', deduction: 15 },
          { id: 'rp-6-w2', action: '记录过于简单', risk: '缺乏关键信息，影响后续诊疗', riskLevel: 'medium', deduction: 10 }
        ]
      },
      {
        id: 'rp-7',
        order: 7,
        name: '术后宣教',
        description: '详细说明术后护理和注意事项',
        category: 'education',
        duration: 5,
        keyInputs: [
          { id: 'rp-7-observation', label: '留观时长(分钟)', type: 'number', required: true, placeholder: '建议留观60分钟' },
          { id: 'rp-7-followup', label: '拆线日期', type: 'date', required: true }
        ],
        correctActions: ['佩戴鼻夹固定', '讲解冰敷方法', '告知避免碰撞鼻部', '说明消肿过程'],
        wrongActions: [
          { id: 'rp-7-w1', action: '未告知佩戴鼻夹', risk: '假体移位影响效果', riskLevel: 'high', deduction: 15 },
          { id: 'rp-7-w2', action: '未说明忌口要求', risk: '饮食不当加重肿胀', riskLevel: 'low', deduction: 5 }
        ]
      }
    ],
    commands: [
      {
        id: 'rp-c-1',
        stepId: 'rp-4',
        content: '量一下鼻根高度',
        timeLimit: 8,
        correctAction: '用卡尺测量鼻根到鼻尖的高度',
        options: [
          { id: 'rp-c-1-o1', text: '用专业卡尺准确测量并报告数值', isCorrect: true, feedback: '正确！测量数据是假体雕刻的重要依据' },
          { id: 'rp-c-1-o2', text: '目测估计大概高度', isCorrect: false, feedback: '错误，目测不准确，必须用工具测量' },
          { id: 'rp-c-1-o3', text: '让医生自己测量', isCorrect: false, feedback: '错误，测量是医助的工作内容' },
          { id: 'rp-c-1-o4', text: '根据经验说一个数值', isCorrect: false, feedback: '错误，必须实际测量，不能凭经验' }
        ],
        riskLevel: 'medium'
      },
      {
        id: 'rp-c-2',
        stepId: 'rp-4',
        content: '15号刀片',
        timeLimit: 3,
        correctAction: '传递15号手术刀片',
        options: [
          { id: 'rp-c-2-o1', text: '传递15号刀片用于假体雕刻', isCorrect: true, feedback: '正确！15号圆头刀适合雕刻假体' },
          { id: 'rp-c-2-o2', text: '传递11号刀片', isCorrect: false, feedback: '错误，11号刀太尖锐，雕刻假体容易切过头' },
          { id: 'rp-c-2-o3', text: '传递假体专用雕刻刀', isCorrect: false, feedback: '错误，虽然有专用雕刻刀，但医生明确要15号' }
        ],
        riskLevel: 'low'
      },
      {
        id: 'rp-c-3',
        stepId: 'rp-4',
        content: '假体修好了，冲洗一下',
        timeLimit: 5,
        correctAction: '用无菌生理盐水反复冲洗假体',
        options: [
          { id: 'rp-c-3-o1', text: '用无菌生理盐水反复冲洗，然后放入抗生素盐水中浸泡', isCorrect: true, feedback: '正确！必须彻底清除雕刻碎屑并消毒' },
          { id: 'rp-c-3-o2', text: '简单冲一下就行', isCorrect: false, feedback: '错误，冲洗不彻底可能残留碎屑', risk: '异物残留可能引起炎症反应' },
          { id: 'rp-c-3-o3', text: '用酒精消毒', isCorrect: false, feedback: '错误，酒精对组织有刺激性，不能用于体内植入物' }
        ],
        riskLevel: 'high'
      },
      {
        id: 'rp-c-4',
        stepId: 'rp-5',
        content: '开始麻醉',
        timeLimit: 5,
        correctAction: '准备抽吸麻醉药',
        options: [
          { id: 'rp-c-4-o1', text: '核对麻药名称和有效期，抽吸后递注射器', isCorrect: true, feedback: '正确！麻醉前必须三查七对' },
          { id: 'rp-c-4-o2', text: '直接把麻药瓶递给医生', isCorrect: false, feedback: '错误，应由医助抽吸好麻药' },
          { id: 'rp-c-4-o3', text: '问医生要抽多少', isCorrect: false, feedback: '错误，应知道隆鼻常规麻醉剂量约2-3ml' }
        ],
        riskLevel: 'high'
      },
      {
        id: 'rp-c-5',
        stepId: 'rp-5',
        content: '鼻骨膜剥离子',
        timeLimit: 3,
        correctAction: '传递鼻骨膜剥离子',
        options: [
          { id: 'rp-c-5-o1', text: '正确传递鼻骨膜剥离子', isCorrect: true, feedback: '正确！骨膜剥离子用于分离骨膜下腔隙' },
          { id: 'rp-c-5-o2', text: '传递普通剥离子', isCorrect: false, feedback: '错误，鼻部有专用剥离子' },
          { id: 'rp-c-5-o3', text: '询问要哪种剥离子', isCorrect: false, feedback: '错误，隆鼻术应准备好专用剥离子' }
        ],
        riskLevel: 'medium'
      },
      {
        id: 'rp-c-6',
        stepId: 'rp-5',
        content: '出血了，快止血',
        timeLimit: 2,
        correctAction: '立即传递肾上腺素棉球和吸引器',
        options: [
          { id: 'rp-c-6-o1', text: '立即传递肾上腺素棉球，同时准备吸引器', isCorrect: true, feedback: '正确！止血要迅速果断' },
          { id: 'rp-c-6-o2', text: '先看一下哪里出血', isCorrect: false, feedback: '错误，出血时立即行动，边做边看', risk: '延误止血可能造成较多出血' },
          { id: 'rp-c-6-o3', text: '给医生递纱布', isCorrect: false, feedback: '错误，纱布止血效果有限，应先用肾上腺素棉球' }
        ],
        riskLevel: 'high'
      },
      {
        id: 'rp-c-7',
        stepId: 'rp-5',
        content: '假体放好了，看看位置正不正',
        timeLimit: 5,
        correctAction: '从多个角度观察假体位置',
        options: [
          { id: 'rp-c-7-o1', text: '从正面、侧面多个角度观察，并与术前设计对比', isCorrect: true, feedback: '正确！假体位置必须从多角度确认' },
          { id: 'rp-c-7-o2', text: '看了一下，挺正的', isCorrect: false, feedback: '错误，观察要细致，不能凭感觉' },
          { id: 'rp-c-7-o3', text: '让顾客坐起来看', isCorrect: false, feedback: '错误，顾客躺着，应该由医助从不同角度观察' }
        ],
        riskLevel: 'medium'
      }
    ],
    risks: [
      { id: 'rp-r1', type: 'missing_check', message: '未确认假体信息！假体植入后无法更换型号', riskLevel: 'critical', relatedStep: 'rp-1' },
      { id: 'rp-r2', type: 'wrong_item', message: '假体消毒不规范！可能导致严重感染需取出假体', riskLevel: 'critical', relatedStep: 'rp-4' },
      { id: 'rp-r3', type: 'incomplete_record', message: '未粘贴假体条形码！无法追溯产品来源', riskLevel: 'high', relatedStep: 'rp-6' }
    ]
  },
  {
    id: 'hyaluronic-acid',
    name: '玻尿酸注射',
    category: '注射美容',
    difficulty: 'easy',
    duration: 25,
    description: '模拟玻尿酸面部注射配合，包括面部评估、注射配合和术后护理',
    icon: 'Syringe',
    steps: [
      {
        id: 'ha-1',
        order: 1,
        name: '顾客身份确认',
        description: '核对顾客信息和注射方案',
        category: 'identity',
        duration: 2,
        requiredItems: ['注射同意书', '术前照片', '玻尿酸产品'],
        keyInputs: [
          { id: 'ha-1-name', label: '顾客姓名', type: 'text', required: true },
          { id: 'ha-1-site', label: '注射部位', type: 'select', options: ['鼻梁', '下巴', '苹果肌', '太阳穴', '法令纹', '唇部'], required: true }
        ],
        correctActions: ['核对姓名和注射部位', '确认无禁忌症', '查看过敏史', '确认已签署同意书'],
        wrongActions: [
          { id: 'ha-1-w1', action: '未确认注射部位', risk: '可能注射错误部位', riskLevel: 'high', deduction: 15 },
          { id: 'ha-1-w2', action: '未询问近期服药史', risk: '如服用抗凝药可能增加淤青风险', riskLevel: 'medium', deduction: 10 }
        ]
      },
      {
        id: 'ha-2',
        order: 2,
        name: '物品准备',
        description: '准备注射用品和玻尿酸产品',
        category: 'preparation',
        duration: 3,
        requiredItems: ['玻尿酸注射器', '钝针/锐针', '表面麻醉膏', '碘伏', '生理盐水', '冰袋', '肾上腺素（备用）'],
        keyInputs: [
          { id: 'ha-2-brand', label: '玻尿酸品牌', type: 'select', options: ['乔雅登', '瑞蓝', '艾莉薇', '伊婉', '润百颜'], required: true },
          { id: 'ha-2-lot', label: '产品批号', type: 'text', required: true, placeholder: '请输入玻尿酸批号' },
          { id: 'ha-2-dose', label: '注射剂量(ml)', type: 'number', required: true, placeholder: '如：1.0' }
        ],
        correctActions: ['检查玻尿酸包装完整性', '核对品牌和型号', '准备好针头等耗材', '准备好急救物品'],
        wrongActions: [
          { id: 'ha-2-w1', action: '未检查玻尿酸有效期', risk: '使用过期产品可能引起不良反应', riskLevel: 'high', deduction: 15 },
          { id: 'ha-2-w2', action: '未准备急救物品', risk: '发生过敏或血管栓塞时无法及时处理', riskLevel: 'high', deduction: 15 }
        ]
      },
      {
        id: 'ha-3',
        order: 3,
        name: '无菌操作配合',
        description: '协助消毒和铺巾',
        category: 'asepsis',
        duration: 3,
        requiredItems: ['碘伏棉球', '无菌铺巾', '无菌手套', '标记笔'],
        correctActions: ['协助标记注射范围', '全面消毒注射区域', '正确佩戴手套', '保持无菌操作'],
        wrongActions: [
          { id: 'ha-3-w1', action: '消毒范围不够大', risk: '可能造成针眼感染', riskLevel: 'medium', deduction: 10 },
          { id: 'ha-3-w2', action: '消毒后用手触摸消毒区域', risk: '污染消毒区域', riskLevel: 'high', deduction: 15 }
        ]
      },
      {
        id: 'ha-4',
        order: 4,
        name: '注射配合',
        description: '配合医生进行注射操作',
        category: 'delivery',
        duration: 10,
        commands: ['ha-c-1', 'ha-c-2', 'ha-c-3', 'ha-c-4'],
        correctActions: ['传递注射器时保护针头', '及时擦血', '观察顾客反应', '塑形时配合按压'],
        wrongActions: [
          { id: 'ha-4-w1', action: '传递时针头污染', risk: '可能造成感染', riskLevel: 'high', deduction: 15 },
          { id: 'ha-4-w2', action: '未观察顾客反应', risk: '过敏或栓塞早期未发现', riskLevel: 'high', deduction: 15 }
        ]
      },
      {
        id: 'ha-5',
        order: 5,
        name: '记录',
        description: '准确记录注射信息',
        category: 'recording',
        duration: 3,
        keyInputs: [
          { id: 'ha-5-needle', label: '使用针头类型', type: 'select', options: ['27G锐针', '30G锐针', '22G钝针', '25G钝针'], required: true },
          { id: 'ha-5-points', label: '注射点数', type: 'number', required: true }
        ],
        correctActions: ['粘贴产品条形码', '记录注射部位和剂量', '记录针头型号', '记录顾客反应'],
        wrongActions: [
          { id: 'ha-5-w1', action: '未粘贴产品条形码', risk: '产品无法追溯', riskLevel: 'high', deduction: 15 },
          { id: 'ha-5-w2', action: '记录注射点数不准确', risk: '影响后续治疗评估', riskLevel: 'low', deduction: 5 }
        ]
      },
      {
        id: 'ha-6',
        order: 6,
        name: '术后宣教',
        description: '告知术后注意事项',
        category: 'education',
        duration: 4,
        keyInputs: [
          { id: 'ha-6-observation', label: '留观时长(分钟)', type: 'number', required: true, placeholder: '建议留观20分钟' },
          { id: 'ha-6-followup', label: '复查日期', type: 'date', required: true }
        ],
        correctActions: ['立即冰敷', '告知避免按压注射部位', '说明消肿时间', '告知异常情况处理'],
        wrongActions: [
          { id: 'ha-6-w1', action: '未告知避免高温环境', risk: '汗蒸桑拿可能加速玻尿酸代谢', riskLevel: 'low', deduction: 5 },
          { id: 'ha-6-w2', action: '未告知血管栓塞征象', risk: '发生栓塞无法早期发现', riskLevel: 'high', deduction: 15 }
        ]
      }
    ],
    commands: [
      {
        id: 'ha-c-1',
        stepId: 'ha-4',
        content: '麻药生效了，准备注射',
        timeLimit: 5,
        correctAction: '打开玻尿酸包装，准备好注射器',
        options: [
          { id: 'ha-c-1-o1', text: '核对玻尿酸产品，打开包装，装好针头递给医生', isCorrect: true, feedback: '正确！严格三查七对，确保产品正确' },
          { id: 'ha-c-1-o2', text: '直接把产品递给医生', isCorrect: false, feedback: '错误，应由医助做好准备工作' },
          { id: 'ha-c-1-o3', text: '询问用什么针头', isCorrect: false, feedback: '错误，应根据注射部位和产品选择合适针头' }
        ],
        riskLevel: 'medium'
      },
      {
        id: 'ha-c-2',
        stepId: 'ha-4',
        content: '顾客说有点疼',
        timeLimit: 3,
        correctAction: '安慰顾客，准备补麻药',
        options: [
          { id: 'ha-c-2-o1', text: '安慰顾客，询问疼痛程度，准备补充麻醉', isCorrect: true, feedback: '正确！首先安抚顾客情绪，然后采取措施' },
          { id: 'ha-c-2-o2', text: '忍一下，很快就好', isCorrect: false, feedback: '错误，忽视顾客感受影响体验' },
          { id: 'ha-c-2-o3', text: '直接停止注射', isCorrect: false, feedback: '错误，应先评估情况再决定' }
        ],
        riskLevel: 'low'
      },
      {
        id: 'ha-c-3',
        stepId: 'ha-4',
        content: '皮肤颜色有点不对',
        timeLimit: 2,
        correctAction: '立即提醒医生可能发生血管栓塞，准备透明质酸酶',
        options: [
          { id: 'ha-c-3-o1', text: '立即提醒医生可能是血管栓塞，准备透明质酸酶和硝酸甘油软膏', isCorrect: true, feedback: '正确！血管栓塞是严重并发症，必须立即处理' },
          { id: 'ha-c-3-o2', text: '可能是紧张吧，没事', isCorrect: false, feedback: '错误，皮肤发白是栓塞早期信号，不能忽视', risk: '延误处理可能导致皮肤坏死' },
          { id: 'ha-c-3-o3', text: '继续注射，观察一下', isCorrect: false, feedback: '错误，可疑时应立即停止注射评估情况' }
        ],
        riskLevel: 'high'
      },
      {
        id: 'ha-c-4',
        stepId: 'ha-4',
        content: '好了，冰敷一下',
        timeLimit: 3,
        correctAction: '用无菌纱布包裹冰袋冰敷注射部位',
        options: [
          { id: 'ha-c-4-o1', text: '用无菌纱布包裹冰袋，轻轻冰敷注射部位', isCorrect: true, feedback: '正确！冰敷可以减轻肿胀和疼痛' },
          { id: 'ha-c-4-o2', text: '冰袋直接敷在皮肤上', isCorrect: false, feedback: '错误，冰袋直接接触皮肤可能造成冻伤' },
          { id: 'ha-c-4-o3', text: '用力按压冰敷', isCorrect: false, feedback: '错误，用力按压可能导致玻尿酸移位' }
        ],
        riskLevel: 'low'
      }
    ],
    risks: [
      { id: 'ha-r1', type: 'missing_check', message: '未询问过敏史和禁忌症！可能发生严重过敏反应', riskLevel: 'high', relatedStep: 'ha-1' },
      { id: 'ha-r2', type: 'wrong_item', message: '未准备透明质酸酶！血管栓塞时无法及时解救', riskLevel: 'critical', relatedStep: 'ha-2' },
      { id: 'ha-r3', type: 'incomplete_record', message: '未记录注射详细信息！影响后续随访', riskLevel: 'medium', relatedStep: 'ha-5' }
    ]
  },
  {
    id: 'thermage',
    name: '热玛吉治疗',
    category: '光电美容',
    difficulty: 'medium',
    duration: 50,
    description: '模拟热玛吉射频紧肤治疗配合，包括术前评估、参数调节和术后护理',
    icon: 'Zap',
    steps: [
      {
        id: 'tm-1',
        order: 1,
        name: '顾客身份确认',
        description: '核对顾客信息和治疗方案',
        category: 'identity',
        duration: 3,
        requiredItems: ['治疗同意书', '术前照片', '禁忌症排查表'],
        keyInputs: [
          { id: 'tm-1-name', label: '顾客姓名', type: 'text', required: true },
          { id: 'tm-1-area', label: '治疗部位', type: 'select', options: ['全面部', '颈部', '眼周', '腹部', '手臂'], required: true }
        ],
        correctActions: ['核对姓名和治疗部位', '确认无植入金属物', '确认未怀孕', '查看近期皮肤状态'],
        wrongActions: [
          { id: 'tm-1-w1', action: '未询问体内金属植入物', risk: '金属在射频作用下发热可能造成烫伤', riskLevel: 'high', deduction: 15 },
          { id: 'tm-1-w2', action: '未确认是否怀孕', risk: '射频可能影响胎儿', riskLevel: 'high', deduction: 15 }
        ]
      },
      {
        id: 'tm-2',
        order: 2,
        name: '物品准备',
        description: '准备治疗用品和设备',
        category: 'preparation',
        duration: 5,
        requiredItems: ['热玛吉探头', '导电膏', '表面麻醉膏', '网格纸', '转印笔', '生理盐水', '冷却设备', '应急药品'],
        keyInputs: [
          { id: 'tm-2-probe', label: '探头型号', type: 'select', options: ['面部4.0探头', '眼部0.25探头', '身体16.0探头'], required: true },
          { id: 'tm-2-pulses', label: '总发数', type: 'number', required: true, placeholder: '如：900' }
        ],
        correctActions: ['检查设备状态', '确认探头包装完好', '准备好导电膏', '调试设备参数'],
        wrongActions: [
          { id: 'tm-2-w1', action: '使用已过期探头', risk: '探头为一次性耗材，过期可能导致烫伤', riskLevel: 'high', deduction: 15 },
          { id: 'tm-2-w2', action: '探头未冷却到合适温度', risk: '温度过高可能造成烫伤', riskLevel: 'high', deduction: 15 }
        ]
      },
      {
        id: 'tm-3',
        order: 3,
        name: '术前准备',
        description: '清洁面部、画网格线',
        category: 'asepsis',
        duration: 7,
        requiredItems: ['洁面乳', '酒精棉片', '网格纸', '转印笔', '麻药'],
        correctActions: ['彻底清洁面部', '去除所有化妆品', '准确转印网格线', '涂抹麻药'],
        wrongActions: [
          { id: 'tm-3-w1', action: '化妆品残留未清洁干净', risk: '可能影响能量传导，导致效果不均', riskLevel: 'medium', deduction: 10 },
          { id: 'tm-3-w2', action: '网格线不对称', risk: '能量分布不均，影响治疗效果', riskLevel: 'medium', deduction: 10 }
        ]
      },
      {
        id: 'tm-4',
        order: 4,
        name: '治疗配合',
        description: '配合医生操作设备，观察顾客反应',
        category: 'delivery',
        duration: 25,
        commands: ['tm-c-1', 'tm-c-2', 'tm-c-3', 'tm-c-4', 'tm-c-5'],
        correctActions: ['随时询问顾客感受', '及时调整冷却强度', '记录每发能量参数', '观察皮肤反应'],
        wrongActions: [
          { id: 'tm-4-w1', action: '未及时降低能量导致烫伤', risk: '顾客皮肤承受不住高能量造成烫伤', riskLevel: 'high', deduction: 15 },
          { id: 'tm-4-w2', action: '冷却喷雾使用不当', risk: '过多冷却液进入眼睛可能造成损伤', riskLevel: 'high', deduction: 15 }
        ]
      },
      {
        id: 'tm-5',
        order: 5,
        name: '治疗记录',
        description: '详细记录治疗参数',
        category: 'recording',
        duration: 5,
        keyInputs: [
          { id: 'tm-5-energy', label: '平均能量级别', type: 'number', required: true, placeholder: '如：3.5' },
          { id: 'tm-5-actual', label: '实际发射发数', type: 'number', required: true }
        ],
        correctActions: ['记录治疗部位和发数', '记录能量参数范围', '记录皮肤反应', '粘贴探头编码'],
        wrongActions: [
          { id: 'tm-5-w1', action: '未记录详细参数', risk: '下次治疗无法参考', riskLevel: 'medium', deduction: 10 },
          { id: 'tm-5-w2', action: '未粘贴探头编码', risk: '无法追溯探头信息', riskLevel: 'medium', deduction: 10 }
        ]
      },
      {
        id: 'tm-6',
        order: 6,
        name: '术后宣教',
        description: '讲解术后护理注意事项',
        category: 'education',
        duration: 5,
        keyInputs: [
          { id: 'tm-6-observation', label: '留观时长(分钟)', type: 'number', required: true, placeholder: '建议留观15分钟' },
          { id: 'tm-6-followup', label: '复诊日期', type: 'date', required: true }
        ],
        correctActions: ['即刻冷敷镇静', '讲解补水保湿重要性', '告知严格防晒', '说明效果显现时间'],
        wrongActions: [
          { id: 'tm-6-w1', action: '未告知严格防晒', risk: '色素沉着风险增加', riskLevel: 'medium', deduction: 10 },
          { id: 'tm-6-w2', action: '未说明效果渐进显现', risk: '顾客期望值过高过早', riskLevel: 'low', deduction: 5 }
        ]
      }
    ],
    commands: [
      {
        id: 'tm-c-1',
        stepId: 'tm-4',
        content: '能量3.5开始，先打下颌线',
        timeLimit: 5,
        correctAction: '设置能量参数，准备开始',
        options: [
          { id: 'tm-c-1-o1', text: '确认能量3.5，涂抹导电膏，准备好冷却喷雾', isCorrect: true, feedback: '正确！能量设置要确认，导电膏要涂抹均匀' },
          { id: 'tm-c-1-o2', text: '直接开始，能量医生自己调', isCorrect: false, feedback: '错误，医助应配合调节参数' },
          { id: 'tm-c-1-o3', text: '用3.0吧，安全点', isCorrect: false, feedback: '错误，应按医生指示操作，有建议可以提但先执行' }
        ],
        riskLevel: 'medium'
      },
      {
        id: 'tm-c-2',
        stepId: 'tm-4',
        content: '顾客说太疼了',
        timeLimit: 3,
        correctAction: '建议降低能量，加强冷却',
        options: [
          { id: 'tm-c-2-o1', text: '安抚顾客，建议医生降低能量，同时增加冷却喷雾', isCorrect: true, feedback: '正确！疼痛明显时应降低能量并加强冷却' },
          { id: 'tm-c-2-o2', text: '忍一下，效果更好', isCorrect: false, feedback: '错误，疼痛阈值因人而异，不能强撑' },
          { id: 'tm-c-2-o3', text: '给顾客吃止痛药', isCorrect: false, feedback: '错误，止痛药效果太慢，应立即调整参数' }
        ],
        riskLevel: 'medium'
      },
      {
        id: 'tm-c-3',
        stepId: 'tm-4',
        content: '靠近眼眶了，注意防护',
        timeLimit: 2,
        correctAction: '确保眼盾在位，调整冷却方向',
        options: [
          { id: 'tm-c-3-o1', text: '确认眼盾在位，调整冷却喷雾方向避免进入眼睛', isCorrect: true, feedback: '正确！眼周治疗必须佩戴眼盾，注意保护眼睛' },
          { id: 'tm-c-3-o2', text: '知道了，会小心', isCorrect: false, feedback: '错误，不是小心就行，必须采取防护措施' },
          { id: 'tm-c-3-o3', text: '让顾客闭上眼睛就行', isCorrect: false, feedback: '错误，闭眼不能完全保护，必须戴眼盾' }
        ],
        riskLevel: 'high'
      },
      {
        id: 'tm-c-4',
        stepId: 'tm-4',
        content: '皮肤有点红，没事吧',
        timeLimit: 3,
        correctAction: '评估红斑程度，准备冷敷',
        options: [
          { id: 'tm-c-4-o1', text: '评估红斑程度，准备冷敷，如果出现水疱立即停止', isCorrect: true, feedback: '正确！红斑是正常反应，但要警惕水疱等过度反应' },
          { id: 'tm-c-4-o2', text: '没事，正常反应', isCorrect: false, feedback: '错误，要密切观察，不能掉以轻心' },
          { id: 'tm-c-4-o3', text: '那我把能量调低', isCorrect: false, feedback: '错误，先评估情况，再决定是否调整' }
        ],
        riskLevel: 'medium'
      },
      {
        id: 'tm-c-5',
        stepId: 'tm-4',
        content: '发数够了，结束治疗',
        timeLimit: 3,
        correctAction: '记录最终发数，准备冷敷',
        options: [
          { id: 'tm-c-5-o1', text: '记录最终发射发数和剩余发数，立即冷敷镇静', isCorrect: true, feedback: '正确！准确记录，术后及时冷敷' },
          { id: 'tm-c-5-o2', text: '探头还剩一些发数，打了吧', isCorrect: false, feedback: '错误，按治疗方案进行，不需要的发数不应盲目打' },
          { id: 'tm-c-5-o3', text: '给顾客敷面膜就行', isCorrect: false, feedback: '错误，应先冷敷降温，再考虑敷面膜' }
        ],
        riskLevel: 'low'
      }
    ],
    risks: [
      { id: 'tm-r1', type: 'missing_check', message: '未排查金属植入物和禁忌症！可能造成严重烫伤', riskLevel: 'critical', relatedStep: 'tm-1' },
      { id: 'tm-r2', type: 'wrong_item', message: '探头使用不当！一次性探头重复使用可能造成感染', riskLevel: 'high', relatedStep: 'tm-2' },
      { id: 'tm-r3', type: 'timing_error', message: '未及时调整能量！顾客疼痛过度或烫伤风险', riskLevel: 'high', relatedStep: 'tm-4' }
    ]
  }
];
