import html2pdf from 'html2pdf.js';

// 全局数据存储
let resumeData = {
  basicInfo: {
    name: '',
    job: '',
    education: '',
    courses: '',
    contact: '',
    github: '',
    website: ''
  },
  skills: [],
  projects: [],
  honors: {
    certificates: '',
    awards: '',
    campus: ''
  }
};

// DOM 元素
const elements = {
  // 智能解析
  smartInput: document.getElementById('smart-input'),
  parseTextBtn: document.getElementById('parse-text'),
  loadDemoBtn: document.getElementById('load-demo'),
  
  // 基础信息
  name: document.getElementById('name'),
  job: document.getElementById('job'),
  education: document.getElementById('education'),
  courses: document.getElementById('courses'),
  contact: document.getElementById('contact'),
  github: document.getElementById('github'),
  website: document.getElementById('website'),
  
  // 技能相关
  skillType: document.getElementById('skill-type'),
  skillContent: document.getElementById('skill-content'),
  addSkillBtn: document.getElementById('add-skill'),
  skillList: document.getElementById('skill-list'),
  
  // 项目相关
  projectName: document.getElementById('project-name'),
  projectTime: document.getElementById('project-time'),
  projectLink: document.getElementById('project-link'),
  projectStatus: document.getElementById('project-status'),
  projectTech: document.getElementById('project-tech'),
  projectHighlights: document.getElementById('project-highlights'),
  projectFeatures: document.getElementById('project-features'),
  projectResults: document.getElementById('project-results'),
  addProjectBtn: document.getElementById('add-project'),
  projectList: document.getElementById('project-list'),
  
  // 荣誉相关
  certificates: document.getElementById('certificates'),
  awards: document.getElementById('awards'),
  campus: document.getElementById('campus'),
  
  // 版本控制
  versionSelect: document.getElementById('version-select'),
  saveVersionBtn: document.getElementById('save-version'),
  exportPdfBtn: document.getElementById('export-pdf'),
  exportBackupBtn: document.getElementById('export-backup'),
  importBackupBtn: document.getElementById('import-backup-btn'),
  importBackupFile: document.getElementById('import-backup'),
  
  // 预览区
  resumePreview: document.getElementById('resume-preview')
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  initEventListeners();
  loadVersions();
  updatePreview();
});

// 事件监听器初始化
function initEventListeners() {
  // 基础信息输入监听
  Object.keys(elements).forEach(key => {
    if (elements[key] && elements[key].tagName && (elements[key].tagName === 'INPUT' || elements[key].tagName === 'TEXTAREA')) {
      if (key.includes('project') || key.includes('skill') || key === 'certificates' || key === 'awards' || key === 'campus') {
        return; // 这些字段单独处理
      }
      elements[key].addEventListener('input', function() {
        resumeData.basicInfo[key] = this.value;
        updatePreview();
      });
    }
  });
  
  // 荣誉信息监听
  elements.certificates.addEventListener('input', function() {
    resumeData.honors.certificates = this.value;
    updatePreview();
  });
  
  elements.awards.addEventListener('input', function() {
    resumeData.honors.awards = this.value;
    updatePreview();
  });
  
  elements.campus.addEventListener('input', function() {
    resumeData.honors.campus = this.value;
    updatePreview();
  });
  
  // 技能相关
  elements.addSkillBtn.addEventListener('click', addSkill);
  
  // 项目相关
  elements.addProjectBtn.addEventListener('click', addProject);
  
  // 智能解析
  elements.parseTextBtn.addEventListener('click', parseSmartInput);
  elements.loadDemoBtn.addEventListener('click', loadDemoResume);
  
  // 版本控制
  elements.versionSelect.addEventListener('change', loadVersion);
  elements.saveVersionBtn.addEventListener('click', saveVersion);
  elements.exportPdfBtn.addEventListener('click', exportPDF);
  elements.exportBackupBtn.addEventListener('click', exportBackup);
  elements.importBackupBtn.addEventListener('click', () => elements.importBackupFile.click());
  elements.importBackupFile.addEventListener('change', importBackup);
}

// 添加技能
function addSkill() {
  const type = elements.skillType.value.trim();
  const content = elements.skillContent.value.trim();
  
  if (!type || !content) {
    alert('请填写技能类别和内容');
    return;
  }
  
  const skill = { type, content };
  resumeData.skills.push(skill);
  
  // 清空输入框
  elements.skillType.value = '';
  elements.skillContent.value = '';
  
  renderSkills();
  updatePreview();
}

// 渲染技能列表
function renderSkills() {
  elements.skillList.innerHTML = resumeData.skills.map((skill, index) => `
    <div class="skill-item">
      <div class="skill-content">
        <div class="skill-type">${skill.type}</div>
        <div class="skill-details">${skill.content}</div>
      </div>
      <button class="delete-btn" onclick="deleteSkill(${index})">删除</button>
    </div>
  `).join('');
}

// 删除技能
window.deleteSkill = function(index) {
  resumeData.skills.splice(index, 1);
  renderSkills();
  updatePreview();
};

// 添加项目
function addProject() {
  const project = {
    name: elements.projectName.value.trim(),
    time: elements.projectTime.value.trim(),
    link: elements.projectLink.value.trim(),
    status: elements.projectStatus.value.trim(),
    tech: elements.projectTech.value.trim(),
    highlights: elements.projectHighlights.value.trim(),
    features: elements.projectFeatures.value.trim(),
    results: elements.projectResults.value.trim()
  };
  
  if (!project.name) {
    alert('请至少填写项目名称');
    return;
  }
  
  resumeData.projects.push(project);
  
  // 清空输入框
  elements.projectName.value = '';
  elements.projectTime.value = '';
  elements.projectLink.value = '';
  elements.projectStatus.value = '';
  elements.projectTech.value = '';
  elements.projectHighlights.value = '';
  elements.projectFeatures.value = '';
  elements.projectResults.value = '';
  
  renderProjects();
  updatePreview();
}

// 渲染项目列表
function renderProjects() {
  elements.projectList.innerHTML = resumeData.projects.map((project, index) => `
    <div class="project-item">
      <div class="project-header">
        <div class="project-title">${project.name}</div>
        <button class="delete-btn" onclick="deleteProject(${index})">删除</button>
      </div>
      <div class="project-details">
        <div><strong>时间：</strong>${project.time}</div>
        <div><strong>链接：</strong>${project.link}</div>
        <div><strong>状态：</strong>${project.status}</div>
        <div><strong>技术栈：</strong>${project.tech}</div>
      </div>
    </div>
  `).join('');
}

// 删除项目
window.deleteProject = function(index) {
  resumeData.projects.splice(index, 1);
  renderProjects();
  updatePreview();
};

// 更新预览
function updatePreview() {
  const { basicInfo, skills, projects, honors } = resumeData;
  
  let html = '';
  
  // 基础信息
  if (basicInfo.name || basicInfo.job) {
    html += `<h1 style="display: flex; align-items: center; color: #6aa0f0; margin-bottom: 12px; margin-top: 0;"><span style="margin-right: 10px;">👩‍💻</span> ${basicInfo.name || '[姓名]'} | ${basicInfo.job || '[求职意向]'}</h1>`;
  }
  
  // 基础信息表格
  if (basicInfo.job || basicInfo.education || basicInfo.courses || basicInfo.contact || basicInfo.github || basicInfo.website) {
    html += `<table style="border-collapse: separate; border-spacing: 0 2px; width: 100%; margin-bottom: 18px; border: none;">`;
    if (basicInfo.job) html += `<tr><td style="padding: 2px 0; font-size: 1em; border: none;"><strong>求职意向</strong>：${basicInfo.job}</td></tr>`;
    if (basicInfo.education) html += `<tr><td style="padding: 2px 0; font-size: 1em; border: none;"><strong>教育背景</strong>：${basicInfo.education}</td></tr>`;
    if (basicInfo.courses) html += `<tr><td style="padding: 2px 0; font-size: 1em; border: none;"><strong>主修课程</strong>：${basicInfo.courses}</td></tr>`;
    if (basicInfo.contact) html += `<tr><td style="padding: 2px 0; font-size: 1em; border: none;"><strong>联系方式</strong>：${basicInfo.contact}</td></tr>`;
    if (basicInfo.github) html += `<tr><td style="padding: 2px 0; font-size: 1em; border: none;"><strong>Github</strong>：${basicInfo.github}</td></tr>`;
    if (basicInfo.website) html += `<tr><td style="padding: 2px 0; font-size: 1em; border: none;"><strong>个人网站</strong>：${basicInfo.website}</td></tr>`;
    html += `</table>`;
  }
  
  // 专业技能
  if (skills.length > 0) {
    html += `<h2 style="display: flex; align-items: center; color: #6aa0f0; margin-bottom: 8px; margin-top: 20px;"><span style="margin-right: 10px;">🛠️</span> 专业技能</h2>`;
    html += `<ul style="margin-top: 3px; margin-bottom: 15px; padding-left: 0; list-style: none;">`;
    skills.forEach(skill => {
      html += `<li style="margin-bottom: 3px;">- <strong>${skill.type}</strong>：${skill.content}</li>`;
    });
    html += `</ul>`;
  }
  
  // 核心项目经验
  if (projects.length > 0) {
    html += `<h2 style="display: flex; align-items: center; color: #6aa0f0; margin-bottom: 8px; margin-top: 20px;"><span style="margin-right: 10px;">🌟</span> 核心项目经验</h2>`;
    
    projects.forEach((project, index) => {
      const statusText = project.status ? `<span style="font-size: 0.85em; font-weight: normal; margin-left: 8px; color: #666;">【${project.status}】</span>` : '';
      
      html += `<h3 style="margin-top: ${index === 0 ? '8px' : '15px'}; margin-bottom: 3px;"><span style="color: #8aadf4; display: flex; align-items: center;"><span style="margin-right: 8px;">🌍</span> ${project.name}${statusText}</span></h3>`;
      
      html += `<div style="padding-left: 2em; margin-bottom: 8px;">`;
      
      if (project.time || project.link) {
        html += `<div style="margin-bottom: 4px;"><span style="font-weight: normal; color: #666; font-size: 0.9em;">${project.time}${project.link ? `（${project.link}）` : ''}</span></div>`;
      }
      
      const projectItems = [];
      if (project.tech) projectItems.push(`<strong>技术栈</strong>：${project.tech}`);
      if (project.highlights) projectItems.push(`<strong>核心亮点</strong>：${project.highlights}`);
      if (project.features) projectItems.push(`<strong>实现功能</strong>：${project.features}`);
      if (project.results) projectItems.push(`<strong>项目成果</strong>：${project.results}`);
      
      if (projectItems.length > 0) {
        html += `<ul style="margin: 0; padding-left: 0; list-style: none;">`;
        projectItems.forEach(item => {
          html += `<li style="margin-bottom: 2px;">- ${item}</li>`;
        });
        html += `</ul>`;
      }
      
      html += `</div>`;
    });
  }
  
  // 荣誉与证书
  if (honors.certificates || honors.awards || honors.campus) {
    html += `<h2 style="display: flex; align-items: center; color: #6aa0f0; margin-bottom: 8px; margin-top: 20px;"><span style="margin-right: 10px;">🏆</span> 荣誉与证书</h2>`;
    html += `<div style="padding-left: 1em;">`;
    if (honors.certificates) html += `<p style="margin-bottom: 6px; color: #333; font-size: 0.95em; line-height: 1.4;"><span style="font-weight: 600; color: #333;">技能证书：</span>${honors.certificates}</p>`;
    if (honors.awards) html += `<p style="margin-bottom: 6px; color: #333; font-size: 0.95em; line-height: 1.4;"><span style="font-weight: 600; color: #333;">获奖经历：</span>${honors.awards}</p>`;
    if (honors.campus) html += `<p style="margin-bottom: 6px; color: #333; font-size: 0.95em; line-height: 1.4;"><span style="font-weight: 600; color: #333;">校园经历：</span>${honors.campus}</p>`;
    html += `</div>`;
  }
  
  elements.resumePreview.innerHTML = html;
}

// 版本管理
function saveVersion() {
  const versionName = prompt("请输入版本名称（如：前端-字节）");
  if (!versionName) return;
  
  // 检查localStorage容量
  const currentSize = JSON.stringify(localStorage).length;
  if (currentSize > 4.5 * 1024 * 1024) {
    alert("本地存储即将满，请先导出备份并删除无用版本！");
    return;
  }
  
  const versionKey = `resume_${versionName}_${Date.now()}`;
  localStorage.setItem(versionKey, JSON.stringify(resumeData));
  
  loadVersions();
  alert(`版本"${versionName}"保存成功！`);
}

function loadVersions() {
  const versions = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('resume_')) {
      const parts = key.split('_');
      const timestamp = parseInt(parts[parts.length - 1]);
      const name = parts.slice(1, -1).join('_');
      versions.push({ key, name, timestamp });
    }
  }
  
  versions.sort((a, b) => b.timestamp - a.timestamp);
  
  elements.versionSelect.innerHTML = '<option value="">选择版本</option>' +
    versions.map(v => `<option value="${v.key}">${v.name} (${new Date(v.timestamp).toLocaleString()})</option>`).join('');
}

function loadVersion() {
  const versionKey = elements.versionSelect.value;
  if (!versionKey) return;
  
  const data = localStorage.getItem(versionKey);
  if (data) {
    resumeData = JSON.parse(data);
    
    // 更新表单
    Object.keys(resumeData.basicInfo).forEach(key => {
      if (elements[key]) {
        elements[key].value = resumeData.basicInfo[key] || '';
      }
    });
    
    elements.certificates.value = resumeData.honors.certificates || '';
    elements.awards.value = resumeData.honors.awards || '';
    elements.campus.value = resumeData.honors.campus || '';
    
    renderSkills();
    renderProjects();
    updatePreview();
  }
}

// PDF导出
function exportPDF() {
  const previewDom = elements.resumePreview;
  const filename = resumeData.basicInfo.name ? 
    `${resumeData.basicInfo.name}_${resumeData.basicInfo.job || '简历'}.pdf` : 
    '我的简历.pdf';
  
  const opt = {
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(previewDom).save();
}

// 备份导出
function exportBackup() {
  const allVersions = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('resume_')) {
      allVersions[key] = JSON.parse(localStorage.getItem(key));
    }
  }
  
  const dataStr = JSON.stringify(allVersions, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = 'resume_backup.json';
  link.click();
}

// 备份导入
function importBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const backupData = JSON.parse(e.target.result);
      
      // 导入所有版本
      Object.keys(backupData).forEach(key => {
        localStorage.setItem(key, JSON.stringify(backupData[key]));
      });
      
      loadVersions();
      alert('备份导入成功！');
    } catch (error) {
      alert('备份文件格式错误！');
    }
  };
  reader.readAsText(file);
}

// 智能解析功能
function parseSmartInput() {
  const text = elements.smartInput.value.trim();
  if (!text) {
    alert('请输入要解析的文本');
    return;
  }
  
  // 清空当前数据
  resumeData = {
    basicInfo: {
      name: '',
      job: '',
      education: '',
      courses: '',
      contact: '',
      github: '',
      website: ''
    },
    skills: [],
    projects: [],
    honors: {
      certificates: '',
      awards: '',
      campus: ''
    }
  };
  
  // 解析基础信息
  parseBasicInfo(text);
  
  // 解析技能
  parseSkills(text);
  
  // 解析项目
  parseProjects(text);
  
  // 解析荣誉
  parseHonors(text);
  
  // 更新界面
  updateFormFields();
  renderSkills();
  renderProjects();
  updatePreview();
  
  alert('解析完成！请检查并完善信息');
}

// 解析基础信息
function parseBasicInfo(text) {
  // 姓名解析 - 通常在开头
  const nameMatch = text.match(/^([^\s,，。]+)/);
  if (nameMatch) {
    resumeData.basicInfo.name = nameMatch[1];
  }
  
  // 求职意向
  const jobPatterns = [
    /求职意向[：:]\s*([^\n,，。]+)/,
    /意向[：:]\s*([^\n,，。]+)/,
    /(前端|后端|全栈|测试|产品|设计|运营|数据|算法|移动端|Android|iOS|Java|Python|Go|PHP|C\+\+|\.NET).*?(工程师|开发|程序员|专员|经理|实习生)/g
  ];
  
  for (const pattern of jobPatterns) {
    const match = text.match(pattern);
    if (match) {
      resumeData.basicInfo.job = match[1] || match[0];
      break;
    }
  }
  
  // 教育背景
  const educationPatterns = [
    /教育背景[：:]\s*([^\n]+)/,
    /学历[：:]\s*([^\n]+)/,
    /([\u4e00-\u9fa5]+大学|[\u4e00-\u9fa5]+学院).*?(专业|学士|硕士|博士|本科|研究生)/
  ];
  
  for (const pattern of educationPatterns) {
    const match = text.match(pattern);
    if (match) {
      resumeData.basicInfo.education = match[1] || match[0];
      break;
    }
  }
  
  // 联系方式
  const phoneMatch = text.match(/1[3-9]\d{9}|\(\+86\)\s*1[3-9]\d{9}|1[3-9]\d-\d{4}-\d{4}/);
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  
  if (phoneMatch || emailMatch) {
    let contact = '';
    if (phoneMatch) contact += phoneMatch[0];
    if (emailMatch) contact += (contact ? ' | ' : '') + emailMatch[0];
    resumeData.basicInfo.contact = contact;
  }
  
  // GitHub
  const githubMatch = text.match(/github\.com\/[a-zA-Z0-9-_]+|https?:\/\/github\.com\/[a-zA-Z0-9-_]+/);
  if (githubMatch) {
    resumeData.basicInfo.github = githubMatch[0].startsWith('http') ? githubMatch[0] : 'https://' + githubMatch[0];
  }
  
  // 个人网站
  const websiteMatch = text.match(/https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g);
  if (websiteMatch) {
    const website = websiteMatch.find(url => !url.includes('github.com'));
    if (website) {
      resumeData.basicInfo.website = website;
    }
  }
}

// 解析技能
function parseSkills(text) {
  const skillPatterns = [
    /技能[：:]\s*([^\n]+)/,
    /专业技能[：:]\s*([^\n]+)/,
    /掌握技能[：:]\s*([^\n]+)/,
    /技术栈[：:]\s*([^\n]+)/
  ];
  
  for (const pattern of skillPatterns) {
    const match = text.match(pattern);
    if (match) {
      const skillText = match[1];
      const skills = skillText.split(/[,，、；;]/).map(s => s.trim()).filter(s => s);
      
      // 按技术类型分类
      const categories = {
        '前端开发': ['JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'HTML', 'CSS', 'SCSS', 'Less', 'jQuery', 'Bootstrap', 'Tailwind'],
        '后端开发': ['Node.js', 'Java', 'Python', 'Go', 'PHP', 'C#', 'C++', 'Spring', 'Express', 'Django', 'Flask'],
        '数据库': ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle'],
        '工具/其他': ['Git', 'Docker', 'Webpack', 'Vite', 'Linux', 'AWS', 'Nginx']
      };
      
      const categorizedSkills = {};
      
      skills.forEach(skill => {
        let category = '其他技能';
        for (const [cat, keywords] of Object.entries(categories)) {
          if (keywords.some(keyword => skill.toLowerCase().includes(keyword.toLowerCase()))) {
            category = cat;
            break;
          }
        }
        
        if (!categorizedSkills[category]) {
          categorizedSkills[category] = [];
        }
        categorizedSkills[category].push(skill);
      });
      
      // 添加到技能列表
      Object.entries(categorizedSkills).forEach(([type, content]) => {
        resumeData.skills.push({
          type,
          content: content.join('、')
        });
      });
      
      break;
    }
  }
}

// 解析项目
function parseProjects(text) {
  // 查找项目部分
  const projectSections = text.split(/项目经验[：:]?|项目[：:]?|作品[：:]?/).slice(1);
  
  projectSections.forEach(section => {
    const lines = section.split('\n').filter(line => line.trim());
    let currentProject = null;
    
    lines.forEach(line => {
      line = line.trim();
      if (!line) return;
      
      // 项目标题（通常包含数字编号或项目名称）
      const projectTitleMatch = line.match(/^\d+\.\s*(.+)|^[-•]\s*(.+)|^([^\-•\d][^：:]+)(?:\s*\(([^)]+)\))?/);
      if (projectTitleMatch && !line.includes('：') && !line.includes(':')) {
        if (currentProject) {
          resumeData.projects.push(currentProject);
        }
        
        const name = projectTitleMatch[1] || projectTitleMatch[2] || projectTitleMatch[3];
        const time = projectTitleMatch[4] || '';
        
        currentProject = {
          name: name.trim(),
          time: time.trim(),
          link: '',
          status: '',
          tech: '',
          highlights: '',
          features: '',
          results: ''
        };
      } else if (currentProject) {
        // 解析项目详情
        if (line.includes('技术栈') || line.includes('技术')) {
          currentProject.tech = line.replace(/.*?[：:]/, '').trim();
        } else if (line.includes('功能') || line.includes('实现')) {
          currentProject.features = line.replace(/.*?[：:]/, '').trim();
        } else if (line.includes('成果') || line.includes('效果') || line.includes('结果')) {
          currentProject.results = line.replace(/.*?[：:]/, '').trim();
        } else if (line.includes('亮点') || line.includes('特色')) {
          currentProject.highlights = line.replace(/.*?[：:]/, '').trim();
        } else if (line.includes('http')) {
          currentProject.link = line.match(/https?:\/\/[^\s]+/)?.[0] || '';
        } else if (line.includes('上线') || line.includes('运营') || line.includes('完成')) {
          currentProject.status = line.replace(/.*?[：:]/, '').trim();
        }
      }
    });
    
    if (currentProject) {
      resumeData.projects.push(currentProject);
    }
  });
}

// 解析荣誉
function parseHonors(text) {
  const honorPatterns = [
    { key: 'certificates', patterns: [/证书[：:]\s*([^\n]+)/, /技能证书[：:]\s*([^\n]+)/, /(CET-\d|四六级|英语|普通话|计算机|工程师).*?证书?/g] },
    { key: 'awards', patterns: [/获奖[：:]\s*([^\n]+)/, /奖项[：:]\s*([^\n]+)/, /荣誉[：:]\s*([^\n]+)/, /(大赛|竞赛|比赛).*?(一等奖|二等奖|三等奖|特等奖|金奖|银奖|铜奖)/g] },
    { key: 'campus', patterns: [/校园经历[：:]\s*([^\n]+)/, /学生工作[：:]\s*([^\n]+)/, /(会长|部长|主席|委员|干部|社团|学生会)/g] }
  ];
  
  honorPatterns.forEach(({ key, patterns }) => {
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        if (pattern.flags && pattern.flags.includes('g')) {
          resumeData.honors[key] = matches.join('、');
        } else {
          resumeData.honors[key] = matches[1] || matches[0];
        }
        break;
      }
    }
  });
}

// 更新表单字段
function updateFormFields() {
  Object.keys(resumeData.basicInfo).forEach(key => {
    if (elements[key]) {
      elements[key].value = resumeData.basicInfo[key] || '';
    }
  });
  
  elements.certificates.value = resumeData.honors.certificates || '';
  elements.awards.value = resumeData.honors.awards || '';
  elements.campus.value = resumeData.honors.campus || '';
}

// 加载示例简历
function loadDemoResume() {
  resumeData = {
    basicInfo: {
      name: 'Tully',
      job: '前端开发工程师',
      education: '西华大学 | 物联网工程（2022.09—2026.06）',
      courses: 'Web前/后端开发技术、数据结构与算法设计、计算机网络、软件工程',
      contact: '(+86) xxx-xxxx-xxxx | 2332486893@qq.com',
      github: 'https://github.com/Tully-L',
      website: 'https://tully.top/'
    },
    skills: [
      {
        type: '前端开发',
        content: 'JavaScript、TypeScript、React、Vue.js、HTML5、CSS3、SCSS、Tailwind CSS'
      },
      {
        type: '后端开发',
        content: 'Node.js、Express、Python、MySQL、MongoDB、RESTful API'
      },
      {
        type: '工具/其他',
        content: 'Git、Webpack、Vite、Docker、Linux、Three.js、Leaflet、响应式设计'
      }
    ],
    projects: [
      {
        name: '交互式校园信息展示网站',
        time: '2025.07-2025.07',
        link: 'https://greenpulsemap.com/',
        status: '已上线运营',
        tech: 'React、TypeScript、Three.js、Leaflet地图引擎、Node.js',
        highlights: 'Three.js 3D地球可视化、交互式地图导航、响应式Web设计、实时数据展示',
        features: '实现校园社团分享、地图定位与导航、信息弹窗展示、移动端适配、用户交互优化',
        results: '独立开发部署，网站已上线，日均访问量约50人，用户平均停留时长提升30%，页面加载速度优化至2秒内'
      },
      {
        name: '个人博客系统',
        time: '2024.12-2025.01',
        link: 'https://blog.tully.top/',
        status: '持续维护',
        tech: 'Vue.js、Nuxt.js、Markdown、GitHub Actions、Vercel',
        highlights: '静态站点生成、SEO优化、自动化部署、深色模式切换',
        features: '文章管理、标签分类、搜索功能、评论系统、RSS订阅、代码高亮',
        results: '累计发布技术文章20+篇，月均访问量200+，获得同学好评，提升个人技术影响力'
      },
      {
        name: '在线简历制作工具',
        time: '2024.10-2024.11',
        link: 'https://resume.tully.top/',
        status: '开源项目',
        tech: 'Vanilla JavaScript、Vite、html2pdf.js、localStorage',
        highlights: '实时预览、PDF导出、版本管理、数据备份、响应式设计',
        features: '交互式表单编辑、多版本简历管理、一键PDF导出、数据本地存储、移动端适配',
        results: '帮助50+同学制作简历，GitHub获得30+ stars，代码简洁易维护，用户体验良好'
      }
    ],
    honors: {
      certificates: '工业互联网平台开发工程师（初级）、CET-6（英语六级）、普通话国家二级甲等证书、计算机二级证书',
      awards: '中国大学生计算机设计大赛省二等奖（2025.5）、蓝桥杯Web应用开发大学组三等奖（2024.4）、四川高校阅读文化节"阅读之星"（连续三年2023-2025）',
      campus: '担任西华大学小球协会会长（2024.9-至今）、获院级三好学生（2023.11）、"三下乡"社会实践活动优秀个人奖（2023.12）、参与学院网站建设项目'
    }
  };
  
  updateFormFields();
  renderSkills();
  renderProjects();
  updatePreview();
  
  alert('示例简历加载完成！这是一份完整的前端开发简历模板');
}