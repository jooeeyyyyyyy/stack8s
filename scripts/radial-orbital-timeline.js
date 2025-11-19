// =====================================================
// RADIAL ORBITAL TIMELINE
// Interactive orbital timeline for platform components
// =====================================================

const platformTimelineData = [
  {
    id: 1,
    title: "Spine",
    eyebrow: "Spine",
    heading: "Network Fabric Mesh",
    description: "Stack8s Spine connects 15+ cloud and edge providers into a unified control plane. Deploy AI workloads where they make strategic, economic, and regulatory sense—without vendor lock-in or compromise.",
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2L10 6L14 6L11 9L12 13L8 11L4 13L5 9L2 6L6 6L8 2Z" fill="currentColor"/>
    </svg>`,
  },
  {
    id: 2,
    title: "Portal",
    eyebrow: "Portal",
    heading: "Cloud {Native} Platform",
    description: "A fully integrated platform built on Kubernetes best practices. We provide a modular, scalable, and secure environment where every component of your stack coexists seamlessly.",
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M6 6H10M6 10H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 3,
    title: "Clusters",
    eyebrow: "Clusters",
    heading: "Multi-Cloud Kubernetes Clusters",
    description: "Provision and manage Kubernetes clusters across any cloud provider. Unified control plane for all your infrastructure needs.",
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="2" fill="currentColor"/>
      <circle cx="12" cy="4" r="2" fill="currentColor"/>
      <circle cx="4" cy="12" r="2" fill="currentColor"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <path d="M6 4H10M4 6V10M12 6V10M6 12H10" stroke="currentColor" stroke-width="1" opacity="0.5"/>
    </svg>`,
  },
  {
    id: 4,
    title: "Marketplace",
    eyebrow: "Marketplace",
    heading: "Component Marketplace",
    description: "Choose from 100+ pre-packaged components—including Ollama, ChromaDB, Kafka, TensorFlow, and RStudio—or bring your own custom container.",
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2L10 6L14 6L11 8L12 12L8 10L4 12L5 8L2 6L6 6L8 2Z" fill="currentColor" opacity="0.3"/>
      <path d="M8 6L9 9L12 9L10 11L11 14L8 12L5 14L6 11L4 9L7 9L8 6Z" fill="currentColor"/>
    </svg>`,
  },
  {
    id: 5,
    title: "Integrations",
    eyebrow: "Integrations",
    heading: "Cloud & Edge Integrations",
    description: "Seamlessly integrate with AWS, Azure, GCP, and 15+ other cloud and edge providers.",
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <circle cx="8" cy="8" r="2" fill="currentColor"/>
      <path d="M8 2V4M8 12V14M2 8H4M12 8H14" stroke="currentColor" stroke-width="1.5"/>
    </svg>`,
  },
];

function initRadialOrbitalTimeline() {
  const container = document.getElementById('radial-timeline-container');
  const orbit = document.getElementById('radial-timeline-orbit');
  
  if (!container || !orbit) return;
  
  let expandedItemId = null;
  let rotationAngle = 0;
  const nodeRefs = {};
  
  // Responsive radius calculation
  function getRadius() {
    const width = window.innerWidth;
    if (width <= 480) return 140; // Small mobile
    if (width <= 768) return 180; // Mobile
    if (width <= 1024) return 220; // Tablet
    return 280; // Desktop
  }
  
  let radius = getRadius();
  const totalItems = platformTimelineData.length;
  
  // Update radius on resize
  window.addEventListener('resize', () => {
    const newRadius = getRadius();
    if (newRadius !== radius) {
      radius = newRadius;
      updateNodePositions();
    }
  });
  
  // Base angle - start from top (270 degrees)
  const baseAngle = 270;
  const angleStep = 360 / totalItems;
  
  // Calculate node position with rotation
  function calculateNodePosition(index, rotationOffset = 0) {
    const angle = (baseAngle + (index * angleStep) + rotationOffset) % 360;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    return { x, y, angle, radian };
  }
  
  // Create nodes
  platformTimelineData.forEach((item, index) => {
    const node = createNode(item, index);
    orbit.appendChild(node);
    nodeRefs[item.id] = node;
  });
  
  // Update all node positions with rotation
  function updateNodePositions() {
    platformTimelineData.forEach((item, index) => {
      const node = nodeRefs[item.id];
      if (!node) return;
      
      const isExpanded = expandedItemId === item.id;
      
      if (isExpanded) {
        // Expanded node goes to top (0, -radius)
        node.style.transform = `translate(0px, -${radius}px)`;
        node.style.zIndex = 200;
      } else {
        // Other nodes rotate around circle
        const position = calculateNodePosition(index, rotationAngle);
        node.style.transform = `translate(${position.x}px, ${position.y}px)`;
        node.style.zIndex = 100;
      }
      
      node.style.opacity = 1;
      
      // Update classes
      node.classList.toggle('expanded', isExpanded);
    });
  }
  
  // Rotate to bring selected node to top
  function rotateToNode(nodeId) {
    const itemIndex = platformTimelineData.findIndex(item => item.id === nodeId);
    if (itemIndex === -1) return;
    
    // Calculate the CURRENT angle of the node (with current rotation applied)
    const currentAngleWithRotation = (baseAngle + (itemIndex * angleStep) + rotationAngle) % 360;
    const targetAngle = 270; // Top position
    
    // Calculate the difference needed to bring current position to top
    let angleDiff = (targetAngle - currentAngleWithRotation) % 360;
    
    // Normalize to shortest rotation
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;
    
    // Apply the rotation difference
    rotationAngle = (rotationAngle + angleDiff) % 360;
    
    // Normalize rotationAngle to 0-360 range
    if (rotationAngle < 0) rotationAngle += 360;
    if (rotationAngle >= 360) rotationAngle -= 360;
    
    updateNodePositions();
  }
  
  // Toggle item expansion
  function toggleItem(itemId) {
    if (expandedItemId === itemId) {
      // Collapse - reset rotation
      expandedItemId = null;
      rotationAngle = 0;
    } else {
      // Expand - rotate to bring to top
      expandedItemId = itemId;
      rotateToNode(itemId);
    }
    
    updateNodePositions();
  }
  
  // Handle click outside nodes/cards (collapse all)
  document.addEventListener('click', (e) => {
    // Only proceed if there's an expanded item
    if (!expandedItemId) return;
    
    // Check if click is on a node, card, or button
    const clickedNode = e.target.closest('.radial-timeline-node');
    const clickedCard = e.target.closest('.radial-timeline-node-card');
    const clickedButton = e.target.closest('.radial-timeline-node-button');
    
    // If click is NOT on any node/card/button, collapse
    if (!clickedNode && !clickedCard && !clickedButton) {
      expandedItemId = null;
      rotationAngle = 0;
      updateNodePositions();
    }
  });
  
  // Create node element
  function createNode(item, index) {
    const node = document.createElement('div');
    node.className = 'radial-timeline-node';
    node.dataset.itemId = item.id;
    node.dataset.index = index; // Store index for reference
    
    const position = calculateNodePosition(index, rotationAngle);
    node.style.transform = `translate(${position.x}px, ${position.y}px)`;
    node.style.zIndex = 100;
    node.style.opacity = 1;
    
    // Pulse effect (static size)
    const pulse = document.createElement('div');
    pulse.className = 'radial-timeline-node-pulse';
    pulse.style.width = `60px`;
    pulse.style.height = `60px`;
    pulse.style.left = `-10px`;
    pulse.style.top = `-10px`;
    node.appendChild(pulse);
    
    // Button
    const button = document.createElement('button');
    button.className = 'radial-timeline-node-button';
    button.innerHTML = item.icon;
    button.setAttribute('aria-label', item.title);
    button.style.cursor = 'pointer';
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleItem(item.id);
    });
    node.appendChild(button);
    
    // Label
    const label = document.createElement('div');
    label.className = 'radial-timeline-node-label';
    label.textContent = item.title;
    node.appendChild(label);
    
    // Card (expanded details)
    const card = createCard(item);
    node.appendChild(card);
    
    return node;
  }
  
  // Create card element
  function createCard(item) {
    const card = document.createElement('div');
    card.className = 'radial-timeline-node-card';
    
    // Eyebrow
    const eyebrow = document.createElement('span');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = item.eyebrow;
    card.appendChild(eyebrow);
    
    // Title
    const title = document.createElement('h3');
    title.className = 'radial-timeline-node-card-title';
    title.textContent = item.heading;
    card.appendChild(title);
    
    // Description
    const description = document.createElement('p');
    description.className = 'radial-timeline-node-card-description';
    description.textContent = item.description;
    card.appendChild(description);
    
    return card;
  }
  
  // Initial position update
  updateNodePositions();
  
  console.log('✓ Radial Orbital Timeline: Initialized with 5 platform components');
}

