// =====================================================
// PLATFORM ORBITAL TIMELINE
// Interactive radial timeline for platform components
// =====================================================

function initPlatformOrbital() {
  const container = document.querySelector('.platform-orbital');
  if (!container) return;

  const platformData = [
    {
      id: 1,
      title: 'Spine',
      subtitle: 'Network Fabric Mesh',
      content: 'Stack8s Spine connects 15+ cloud and edge providers into a unified control plane. Deploy AI workloads where they make strategic, economic, and regulatory sense.',
      icon: '🕸️',
      relatedIds: [2, 5],
      status: 'active',
      category: 'Infrastructure'
    },
    {
      id: 2,
      title: 'Portal',
      subtitle: 'Cloud {Native} Platform',
      content: 'A fully integrated platform built on Kubernetes best practices. Modular, scalable, and secure environment where every component of your stack coexists seamlessly.',
      icon: '🚪',
      relatedIds: [1, 3],
      status: 'active',
      category: 'Platform'
    },
    {
      id: 3,
      title: 'Clusters',
      subtitle: 'Multi-Cloud Kubernetes',
      content: 'Provision and manage Kubernetes clusters across any cloud provider. Unified control plane for all your infrastructure needs.',
      icon: '☸️',
      relatedIds: [2, 4],
      status: 'active',
      category: 'Compute'
    },
    {
      id: 4,
      title: 'Marketplace',
      subtitle: 'Component Marketplace',
      content: 'Choose from 100+ pre-packaged components—including Ollama, ChromaDB, Kafka, TensorFlow, and RStudio—or bring your own custom container.',
      icon: '🛒',
      relatedIds: [3, 5],
      status: 'active',
      category: 'Services'
    },
    {
      id: 5,
      title: 'Integrations',
      subtitle: 'Cloud & Edge',
      content: 'Seamlessly integrate with AWS, Azure, GCP, and 15+ other cloud and edge providers.',
      icon: '🔗',
      relatedIds: [1, 4],
      status: 'active',
      category: 'Connectivity'
    }
  ];

  let expandedNodeId = null;
  let rotationAngle = 0;
  let autoRotate = true;
  let animationId = null;

  const orbitalContainer = container.querySelector('.platform-orbital__container');
  const orbit = container.querySelector('.platform-orbital__orbit');
  const detailCard = container.querySelector('.platform-orbital__detail');

  // Create nodes
  platformData.forEach((item, index) => {
    const node = document.createElement('div');
    node.className = 'platform-orbital__node';
    node.setAttribute('data-id', item.id);
    node.innerHTML = `
      <div class="platform-orbital__node-icon">${item.icon}</div>
      <div class="platform-orbital__node-label">${item.title}</div>
    `;
    
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNode(item.id);
    });
    
    orbit.appendChild(node);
  });

  // Close on container click
  orbitalContainer.addEventListener('click', (e) => {
    if (e.target === orbitalContainer || e.target === orbit) {
      closeDetail();
    }
  });

  function calculateNodePosition(index, total, angle) {
    const nodeAngle = ((index / total) * 360 + angle) % 360;
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.25;
    const radian = (nodeAngle * Math.PI) / 180;
    
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.5, Math.min(1, 0.5 + 0.5 * ((1 + Math.sin(radian)) / 2)));
    const scale = Math.max(0.8, Math.min(1, 0.8 + 0.2 * ((1 + Math.sin(radian)) / 2)));
    
    return { x, y, zIndex, opacity, scale };
  }

  function updateNodes() {
    const nodes = orbit.querySelectorAll('.platform-orbital__node');
    
    nodes.forEach((node, index) => {
      const nodeId = parseInt(node.getAttribute('data-id'));
      const position = calculateNodePosition(index, nodes.length, rotationAngle);
      const isExpanded = nodeId === expandedNodeId;
      
      node.style.transform = `translate(${position.x}px, ${position.y}px) scale(${isExpanded ? 1.2 : position.scale})`;
      node.style.zIndex = isExpanded ? 200 : position.zIndex;
      node.style.opacity = isExpanded ? 1 : position.opacity;
      
      if (isExpanded) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });
  }

  function toggleNode(id) {
    if (expandedNodeId === id) {
      closeDetail();
    } else {
      showDetail(id);
    }
  }

  function showDetail(id) {
    const item = platformData.find(p => p.id === id);
    if (!item) return;

    expandedNodeId = id;
    autoRotate = false;

    // Update detail card
    detailCard.innerHTML = `
      <div class="platform-orbital__detail-header">
        <div class="platform-orbital__detail-icon">${item.icon}</div>
        <div>
          <h3 class="platform-orbital__detail-title">${item.title}</h3>
          <p class="platform-orbital__detail-subtitle">${item.subtitle}</p>
        </div>
        <span class="platform-orbital__detail-category">${item.category}</span>
      </div>
      <div class="platform-orbital__detail-content">
        <p>${item.content}</p>
      </div>
      ${item.relatedIds.length > 0 ? `
        <div class="platform-orbital__detail-related">
          <h4 class="platform-orbital__detail-related-title">Related Components</h4>
          <div class="platform-orbital__detail-related-items">
            ${item.relatedIds.map(relId => {
              const relItem = platformData.find(p => p.id === relId);
              return `
                <button class="platform-orbital__detail-related-btn" data-id="${relId}">
                  ${relItem.icon} ${relItem.title}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}
    `;

    detailCard.classList.add('visible');

    // Add event listeners to related buttons
    detailCard.querySelectorAll('.platform-orbital__detail-related-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const relId = parseInt(btn.getAttribute('data-id'));
        showDetail(relId);
      });
    });

    updateNodes();
  }

  function closeDetail() {
    expandedNodeId = null;
    autoRotate = true;
    detailCard.classList.remove('visible');
    updateNodes();
  }

  function animate() {
    if (autoRotate) {
      rotationAngle = (rotationAngle + 0.2) % 360;
      updateNodes();
    }
    animationId = requestAnimationFrame(animate);
  }

  // Start animation
  updateNodes();
  animate();

  // Handle resize
  window.addEventListener('resize', updateNodes);

  console.log('✓ Platform Orbital: Interactive radial timeline initialized');
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPlatformOrbital);
} else {
  initPlatformOrbital();
}
