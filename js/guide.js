document.addEventListener("DOMContentLoaded", function() {
  fetch('./data/guideData.json')
    .then(response => response.json())
    .then(data => {
      const guideContent = document.getElementById('guideContent');
      
      for (const section in data) {
        if (data.hasOwnProperty(section)) {
          // h2 태그 추가
          const h2 = document.createElement('h2');
          h2.textContent = section;
          guideContent.appendChild(h2);
          
          // 각 섹션의 항목들에 대해 버튼 및 패널 생성
          data[section].forEach(item => {
            const button = document.createElement('button');
            button.className = 'accordion';
            button.textContent = item.title;
            guideContent.appendChild(button);

            const panel = document.createElement('div');
            panel.className = 'panel';

            // 내용 추가
            if (typeof item.content === 'string') {
              const p = document.createElement('p');
              p.textContent = item.content;
              panel.appendChild(p);
            } else {
              for (const key in item.content) {
                if (item.content.hasOwnProperty(key)) {
                  const p = document.createElement('p');
                  p.textContent = item.content[key];
                  panel.appendChild(p);
                }
              }
            }

            // 공식 추가
            if (item.formula) {
              const p = document.createElement('p');
              p.textContent = `공식: ${item.formula}`;
              panel.appendChild(p);
            }

            guideContent.appendChild(panel);
          });
        }
      }

      // 아코디언 기능 추가
      var acc = document.getElementsByClassName("accordion");
      for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
          this.classList.toggle("active");
          var panel = this.nextElementSibling;
          if (panel.style.display === "block") {
            panel.style.display = "none";
          } else {
            panel.style.display = "block";
          }
        });
      }
    })
    .catch(error => console.error('Error fetching guide data:', error));
});
