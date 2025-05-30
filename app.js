// Dashboard data
const dashboardData = {
  "overview": {
    "total_students": 1126690,
    "growth_rate": 6.6,
    "percentage_of_us_students": 5.9,
    "asian_students_percentage": 71.5,
    "year": "2023-24"
  },
  "countries": [
    {"rank": 1, "country": "インド", "students": 268923, "percentage": 23.9},
    {"rank": 2, "country": "中国", "students": 289526, "percentage": 25.7},
    {"rank": 3, "country": "韓国", "students": 43847, "percentage": 3.9},
    {"rank": 4, "country": "カナダ", "students": 27876, "percentage": 2.5},
    {"rank": 5, "country": "台湾", "students": 21834, "percentage": 1.9},
    {"rank": 6, "country": "ベトナム", "students": 21900, "percentage": 1.9},
    {"rank": 7, "country": "ナイジェリア", "students": 17640, "percentage": 1.6},
    {"rank": 8, "country": "バングラデシュ", "students": 15000, "percentage": 1.3},
    {"rank": 9, "country": "ブラジル", "students": 16025, "percentage": 1.4},
    {"rank": 10, "country": "ネパール", "students": 14000, "percentage": 1.2},
    {"rank": 13, "country": "日本", "students": 13959, "percentage": 1.2}
  ],
  "majors": [
    {"field": "Math and Computer Science", "percentage": 20.4},
    {"field": "Engineering", "percentage": 18.6},
    {"field": "Business and Management", "percentage": 16.0},
    {"field": "Other Fields", "percentage": 13.3},
    {"field": "Physical and Life Sciences", "percentage": 10.7}
  ],
  "states": [
    {"state": "カリフォルニア州", "percentage": 16.0},
    {"state": "ニューヨーク州", "percentage": 12.4},
    {"state": "テキサス州", "percentage": 8.0},
    {"state": "マサチューセッツ州", "percentage": 6.2},
    {"state": "イリノイ州", "percentage": 5.3}
  ]
};

// Chart colors
const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    addInteractiveEffects();
    animateStatNumbers();
});

// Initialize all charts
function initializeCharts() {
    createCountriesChart();
    createMajorsChart();
    createStatesChart();
}

// Create countries ranking chart
function createCountriesChart() {
    const ctx = document.getElementById('countriesChart').getContext('2d');
    
    const countries = dashboardData.countries.map(item => item.country);
    const students = dashboardData.countries.map(item => item.students);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: countries,
            datasets: [{
                label: '留学生数',
                data: students,
                backgroundColor: chartColors.slice(0, countries.length),
                borderColor: chartColors.slice(0, countries.length),
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const percentage = dashboardData.countries[context.dataIndex].percentage;
                            return `${context.parsed.y.toLocaleString()}人 (${percentage}%)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + '人';
                        }
                    },
                    grid: {
                        color: 'rgba(94, 82, 64, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Create majors pie chart
function createMajorsChart() {
    const ctx = document.getElementById('majorsChart').getContext('2d');
    
    const majors = dashboardData.majors.map(item => item.field);
    const percentages = dashboardData.majors.map(item => item.percentage);
    
    // Translate major fields to Japanese
    const majorTranslations = {
        'Math and Computer Science': '数学・コンピューター科学',
        'Engineering': '工学',
        'Business and Management': 'ビジネス・経営学',
        'Other Fields': 'その他の分野',
        'Physical and Life Sciences': '物理・生命科学'
    };
    
    const translatedMajors = majors.map(major => majorTranslations[major] || major);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: translatedMajors,
            datasets: [{
                data: percentages,
                backgroundColor: chartColors.slice(0, majors.length),
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            },
            cutout: '60%'
        }
    });
}

// Create states chart
function createStatesChart() {
    const ctx = document.getElementById('statesChart').getContext('2d');
    
    const states = dashboardData.states.map(item => item.state);
    const percentages = dashboardData.states.map(item => item.percentage);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: states,
            datasets: [{
                label: '留学生の割合',
                data: percentages,
                backgroundColor: chartColors.slice(0, states.length),
                borderColor: chartColors.slice(0, states.length),
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(94, 82, 64, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Add interactive effects
function addInteractiveEffects() {
    // Add click handlers for cards
    const cards = document.querySelectorAll('.stat-card, .visa-card, .timeline-item, .note-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Add hover effects for platform tags
    const platformTags = document.querySelectorAll('.platform-tag');
    platformTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // Add section scroll highlighting
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Animate stat numbers
function animateStatNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// Animate individual number
function animateNumber(element) {
    const text = element.textContent;
    const hasPercentage = text.includes('%');
    const hasPlus = text.includes('+');
    const number = parseFloat(text.replace(/[^\d.-]/g, ''));
    
    if (isNaN(number)) return;
    
    let current = 0;
    const increment = number / 50; // 50 steps
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        let displayValue = '';
        if (number >= 1000000) {
            displayValue = (current / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            displayValue = Math.round(current).toLocaleString();
        } else {
            displayValue = current.toFixed(1);
        }
        
        if (hasPlus) displayValue = '+' + displayValue;
        if (hasPercentage) displayValue += '%';
        if (text.includes('人')) displayValue += '人';
        
        element.textContent = displayValue;
    }, 30);
}

// Smooth scroll for internal links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Print functionality
function printDashboard() {
    window.print();
}

// Export data functionality
function exportData() {
    const dataStr = JSON.stringify(dashboardData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'visa-dashboard-data.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Handle responsive chart resizing
window.addEventListener('resize', function() {
    // Charts will automatically resize due to responsive: true option
    // This event listener is here for any additional responsive handling if needed
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        // Ensure proper tab navigation through interactive elements
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        // Add visual focus indicators
        focusableElements.forEach(el => {
            el.addEventListener('focus', function() {
                this.style.outline = '2px solid var(--color-primary)';
                this.style.outlineOffset = '2px';
            });
            
            el.addEventListener('blur', function() {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });
    }
});

// Add error handling for chart initialization
window.addEventListener('error', function(e) {
    console.error('Dashboard error:', e.error);
    
    // Show user-friendly error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'alert-card card';
    errorMessage.innerHTML = `
        <div class="card__body">
            <h3>⚠️ エラーが発生しました</h3>
            <p>ダッシュボードの一部のデータが正しく読み込まれませんでした。ページを再読み込みしてください。</p>
        </div>
    `;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(errorMessage, container.firstChild);
    }
});

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
            console.log(`Dashboard performance - ${entry.name}: ${entry.duration}ms`);
        }
    }
});

if ('PerformanceObserver' in window) {
    performanceObserver.observe({ entryTypes: ['measure'] });
    performance.mark('dashboard-start');
    
    window.addEventListener('load', () => {
        performance.mark('dashboard-end');
        performance.measure('dashboard-load-time', 'dashboard-start', 'dashboard-end');
    });
}