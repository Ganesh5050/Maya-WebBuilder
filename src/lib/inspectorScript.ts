export const inspectorScript = `
(function() {
  console.log('🕵️ Inspector Script Loaded');
  let active = false;
  let hoveredElement = null;
  let overlay = null;

  function createOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.pointerEvents = 'none';
    overlay.style.border = '2px solid #3b82f6';
    overlay.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    overlay.style.zIndex = '9999';
    overlay.style.transition = 'all 0.1s ease';
    overlay.style.display = 'none';
    overlay.style.borderRadius = '4px';
    
    // Add label
    const label = document.createElement('span');
    label.style.position = 'absolute';
    label.style.top = '-24px';
    label.style.left = '0';
    label.style.backgroundColor = '#3b82f6';
    label.style.color = 'white';
    label.style.padding = '2px 6px';
    label.style.borderRadius = '4px';
    label.style.fontSize = '12px';
    label.style.fontWeight = 'bold';
    label.innerText = 'Select';
    overlay.appendChild(label);
    
    document.body.appendChild(overlay);
  }

  window.addEventListener('message', (event) => {
    if (event.data.type === 'TOGGLE_INSPECTOR') {
      active = event.data.active;
      console.log('🕵️ Inspector Mode:', active ? 'ON' : 'OFF');
      // Create overlay if missing
      createOverlay();
      
      document.body.style.cursor = active ? 'crosshair' : 'default';
      if (!active && overlay) {
         overlay.style.display = 'none';
      }
    }
  });

  document.addEventListener('mouseover', (e) => {
    if (!active) return;
    
    // e.stopPropagation(); // Don't block other events yet
    
    const target = e.target;
    // meaningful block elements
    const meaningful = target.closest('section, header, footer, button, a, h1, h2, h3, p, img, .card, .container');
    
    if (meaningful && meaningful !== document.body) {
      hoveredElement = meaningful;
      const rect = meaningful.getBoundingClientRect();
      
      if (overlay) {
        overlay.style.display = 'block';
        overlay.style.top = rect.top + 'px';
        overlay.style.left = rect.left + 'px';
        overlay.style.width = rect.width + 'px';
        overlay.style.height = rect.height + 'px';
        
        // Update label
        const tagName = meaningful.tagName.toLowerCase();
        const id = meaningful.id ? '#' + meaningful.id : '';
        overlay.querySelector('span').innerText = tagName + id;
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!active || !hoveredElement) return;
    e.preventDefault();
    e.stopPropagation();

    const tagName = hoveredElement.tagName.toLowerCase();
    const id = hoveredElement.id || '';
    const text = hoveredElement.innerText ? hoveredElement.innerText.substring(0, 100) : '';
    const className = hoveredElement.className;

    console.log('🎯 Element Selected:', tagName);

    // Send to parent
    window.parent.postMessage({
      type: 'ELEMENT_SELECTED',
      element: { tagName, id, text, className }
    }, '*');

    // Visual feedback
    if (overlay) {
        overlay.style.borderColor = '#10b981'; // Green
        overlay.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
        overlay.querySelector('span').style.backgroundColor = '#10b981';
        overlay.querySelector('span').innerText = 'Selected!';
        setTimeout(() => {
            overlay.style.borderColor = '#3b82f6';
            overlay.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            overlay.querySelector('span').style.backgroundColor = '#3b82f6';
        }, 800);
    }
    
  }, true); // Capture phase to prevent default links
})();
`;
