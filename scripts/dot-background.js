/**
 * Vanilla JS WebGL Dot Shader Background
 * Inspired by React Three Fiber implementation
 */

class DotBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.uniforms = {};
    this.mouseX = 0.5;
    this.mouseY = 0.5;
    this.time = 0;
    this.animationId = null;
    
    this.init();
  }
  
  init() {
    console.log('🎨 Initializing DotBackground...');
    
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'dot-background-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    `;
    
    // Insert at the beginning of body
    if (this.container.firstChild) {
      this.container.insertBefore(this.canvas, this.container.firstChild);
    } else {
      this.container.appendChild(this.canvas);
    }
    
    console.log('📐 Canvas created:', this.canvas);
    
    // Get WebGL context
    this.gl = this.canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false }) || 
              this.canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });
    
    if (!this.gl) {
      console.error('❌ WebGL not supported');
      return;
    }
    
    console.log('✅ WebGL context created');
    
    // Set canvas size
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Track mouse
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('touchmove', (e) => this.onTouchMove(e));
    
    // Setup WebGL
    this.setupWebGL();
    
    console.log('🚀 Starting animation...');
    
    // Start animation
    this.animate();
  }
  
  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    
    console.log('📏 Canvas resized:', this.canvas.width, 'x', this.canvas.height);
    
    if (this.gl) {
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      this.updateResolution();
    }
  }
  
  updateResolution() {
    if (this.uniforms.resolution) {
      this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
    }
  }
  
  onMouseMove(e) {
    this.mouseX = e.clientX / window.innerWidth;
    this.mouseY = 1.0 - (e.clientY / window.innerHeight);
  }
  
  onTouchMove(e) {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.mouseX = touch.clientX / window.innerWidth;
      this.mouseY = 1.0 - (touch.clientY / window.innerHeight);
    }
  }
  
  setupWebGL() {
    const gl = this.gl;
    
    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
    
    // Fragment shader
    const fragmentShaderSource = `
      precision mediump float;
      
      uniform float time;
      uniform vec2 resolution;
      uniform vec3 dotColor;
      uniform vec3 glowColor;
      uniform vec2 mousePos;
      uniform float gridSize;
      uniform float dotOpacity;
      
      float circle(vec2 p, float r) {
        return length(p - 0.5) - r;
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        
        // Create dense grid
        vec2 gridUv = fract(uv * gridSize);
        vec2 gridCenter = (floor(uv * gridSize) + 0.5) / gridSize;
        
        // Small dot size
        float dotSize = 0.03;
        float dist = circle(gridUv, dotSize);
        float dot = smoothstep(0.04, 0.0, dist);
        
        // Mouse distance for glow effect
        float mouseDist = length(gridCenter - mousePos);
        float mouseGlow = smoothstep(0.3, 0.0, mouseDist);
        
        // Pulse that oscillates between 0.6 and 1.0 (never fully disappears)
        float pulse = sin(time * 0.9 + mouseDist * 10.0) * 0.3 + 0.7;
        float animatedMouseGlow = mouseGlow * pulse;
        
        // Slow wave animation on the sides
        float distFromCenter = abs(uv.x - 0.5);
        float sideGlow = smoothstep(0.3, 0.5, distFromCenter);
        
        // Slow moving wave on sides
        float waveSpeed = time * 0.3;
        float wave = sin(uv.y * 8.0 + waveSpeed) * 0.5 + 0.5;
        float sideAnimation = sideGlow * wave * 0.7;
        
        // Combine mouse glow and side glow
        float totalGlow = max(animatedMouseGlow, sideAnimation);
        
        // Mix white dots with blue glow
        vec3 finalColor = mix(dotColor, glowColor, totalGlow);
        float finalOpacity = dot * (dotOpacity + totalGlow * 1.1);
        
        gl_FragColor = vec4(finalColor, finalOpacity);
      }
    `;
    
    // Compile shaders
    const vertexShader = this.compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    
    // Create program
    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);
    
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error('❌ Program link error:', gl.getProgramInfoLog(this.program));
      return;
    }
    
    console.log('✅ Shader program linked successfully');
    
    gl.useProgram(this.program);
    
    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    console.log('✅ WebGL blending enabled');
    
    // Create geometry (full screen quad)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    
    const positionLocation = gl.getAttribLocation(this.program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Get uniform locations
    this.uniforms = {
      time: gl.getUniformLocation(this.program, 'time'),
      resolution: gl.getUniformLocation(this.program, 'resolution'),
      dotColor: gl.getUniformLocation(this.program, 'dotColor'),
      glowColor: gl.getUniformLocation(this.program, 'glowColor'),
      mousePos: gl.getUniformLocation(this.program, 'mousePos'),
      gridSize: gl.getUniformLocation(this.program, 'gridSize'),
      dotOpacity: gl.getUniformLocation(this.program, 'dotOpacity'),
    };
    
    // Set initial uniform values
    this.updateResolution();
    gl.uniform3f(this.uniforms.dotColor, 1.0, 1.0, 1.0); // White dots
    gl.uniform3f(this.uniforms.glowColor, 0.0, 0.851, 1.0); // #00d9ff blue glow
    gl.uniform2f(this.uniforms.mousePos, 0.5, 0.5);
    gl.uniform1f(this.uniforms.gridSize, 80.0); // Dense grid (80x80)
    gl.uniform1f(this.uniforms.dotOpacity, 0.25); // More visible base opacity
    
    console.log('✅ Uniforms initialized - Grid: 80x80, Opacity: 0.25');
  }
  
  compileShader(source, type) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('❌ Shader compile error:', gl.getShaderInfoLog(shader));
      console.error('Shader source:', source);
      gl.deleteShader(shader);
      return null;
    }
    
    const typeName = type === gl.VERTEX_SHADER ? 'Vertex' : 'Fragment';
    console.log(`✅ ${typeName} shader compiled`);
    
    return shader;
  }
  
  animate() {
    this.time += 0.016; // ~60fps
    
    const gl = this.gl;
    if (!gl || !this.program) return;
    
    gl.useProgram(this.program);
    
    // Update uniforms
    gl.uniform1f(this.uniforms.time, this.time);
    gl.uniform2f(this.uniforms.mousePos, this.mouseX, this.mouseY);
    
    // Clear with transparency
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new DotBackground(document.body);
  });
} else {
  new DotBackground(document.body);
}

