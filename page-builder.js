app.pbState = {
    productId: null,
    product: null,
    slug: '',
    blocks: [],
    previewMode: 'desktop',
    editingBlockId: null
};

app.pbAvailableBlocks = [
    { type: 'hero', label: 'Hero (Topo)', icon: 'layout-template' },
    { type: 'features', label: 'Benefícios', icon: 'list-checks' },
    { type: 'video', label: 'Vídeo VSL', icon: 'video' },
    { type: 'testimonial', label: 'Depoimento', icon: 'message-square' }
];

app.openPageBuilder = function(productId) {
    this.pbState.productId = productId;
    this.pbState.product = this.products.find(p => String(p.id) === productId);
    if (!this.pbState.product) return;

    const savedData = localStorage.getItem(`dito_pb_${productId}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        this.pbState.slug = data.slug || this.pbState.product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        this.pbState.blocks = data.blocks || [];
    } else {
        this.pbState.slug = this.pbState.product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        this.pbState.blocks = [
            { id: Date.now().toString(), type: 'hero', config: { title: this.pbState.product.name, subtitle: 'Sua subheadline matadora aqui.', ctaText: 'QUERO COMPRAR AGORA', ctaColor: '#10b981', textColor: '#000000', bgColor: '#ffffff' } }
        ];
    }
    
    this.navigate('page-builder');
};

app.renderPageBuilder = function() {
    const container = document.getElementById('app-container');
    const tpl = document.getElementById('template-page-builder');
    if (!tpl) return;
    container.innerHTML = '';
    container.appendChild(tpl.content.cloneNode(true));
    
    document.getElementById('pb-slug').value = this.pbState.slug;
    document.getElementById('pb-live-link').href = `?p=${this.pbState.slug}`;
    
    document.getElementById('pb-slug').addEventListener('input', (e) => {
        this.pbState.slug = e.target.value.toLowerCase().replace(/[^a-z0-9\-]+/g, '-');
        e.target.value = this.pbState.slug;
        document.getElementById('pb-live-link').href = `?p=${this.pbState.slug}`;
    });

    this.pbRenderSidebar();
    this.pbRenderPreview();
    
    if (window.lucide) lucide.createIcons();
};

app.pbSetPreviewMode = function(mode) {
    this.pbState.previewMode = mode;
    const frame = document.getElementById('pb-preview-frame');
    document.getElementById('pb-btn-desktop').style.color = mode === 'desktop' ? '#000' : '#999';
    document.getElementById('pb-btn-mobile').style.color = mode === 'mobile' ? '#000' : '#999';
    
    if (mode === 'mobile') {
        frame.style.maxWidth = '375px';
    } else {
        frame.style.maxWidth = '1000px';
    }
};

app.pbRenderSidebar = function() {
    const list = document.getElementById('pb-active-blocks');
    if (!list) return;
    
    list.innerHTML = this.pbState.blocks.map((block, index) => `
        <div style="background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 12px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: 0.2s;" onmouseover="this.style.borderColor='#000'" onmouseout="this.style.borderColor='#eee'" onclick="app.pbEditBlock('${block.id}')">
            <div style="display: flex; align-items: center; gap: 8px;">
                <i data-lucide="layout" style="width: 14px; color: #999;"></i>
                <span style="font-size: 12px; font-weight: 800; text-transform: uppercase;">${block.type}</span>
            </div>
            <div style="display: flex; gap: 4px;">
                <button onclick="event.stopPropagation(); app.pbMoveBlock(${index}, -1)" style="background:none; border:none; cursor:pointer;"><i data-lucide="chevron-up" style="width:14px;"></i></button>
                <button onclick="event.stopPropagation(); app.pbMoveBlock(${index}, 1)" style="background:none; border:none; cursor:pointer;"><i data-lucide="chevron-down" style="width:14px;"></i></button>
                <button onclick="event.stopPropagation(); app.pbDeleteBlock('${block.id}')" style="background:none; border:none; cursor:pointer; color:red;"><i data-lucide="trash" style="width:14px;"></i></button>
            </div>
        </div>
    `).join('');
    
    if (window.lucide) lucide.createIcons();
};

app.pbMoveBlock = function(index, dir) {
    if (index + dir < 0 || index + dir >= this.pbState.blocks.length) return;
    const temp = this.pbState.blocks[index];
    this.pbState.blocks[index] = this.pbState.blocks[index + dir];
    this.pbState.blocks[index + dir] = temp;
    this.pbRenderSidebar();
    this.pbRenderPreview();
};

app.pbDeleteBlock = function(id) {
    this.pbState.blocks = this.pbState.blocks.filter(b => b.id !== id);
    this.pbRenderSidebar();
    this.pbRenderPreview();
};

app.pbShowAddBlock = function() {
    const modal = document.getElementById('pb-add-block-modal');
    const list = document.getElementById('pb-available-blocks');
    
    list.innerHTML = this.pbAvailableBlocks.map(b => `
        <div onclick="app.pbAddBlock('${b.type}')" style="background: #f9f9f9; border: 1px solid #eee; padding: 16px; border-radius: 16px; text-align: center; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background='#f9f9f9'">
            <i data-lucide="${b.icon}" style="width: 24px; margin-bottom: 8px;"></i>
            <p style="font-weight: 900; font-size: 12px;">${b.label}</p>
        </div>
    `).join('');
    
    modal.style.display = 'flex';
    if (window.lucide) lucide.createIcons();
};

app.pbAddBlock = function(type) {
    const newBlock = { id: Date.now().toString(), type, config: {} };
    if (type === 'hero') newBlock.config = { title: 'Nova Seção Hero', subtitle: 'Subtítulo', ctaText: 'Comprar', bgColor: '#ffffff', textColor: '#000000', ctaColor: '#10b981' };
    if (type === 'features') newBlock.config = { title: 'Benefícios', items: 'Rápido\nSeguro\nFácil', bgColor: '#f9f9f9', textColor: '#000000' };
    if (type === 'testimonial') newBlock.config = { text: 'Produto incrível!', author: 'João', role: 'Cliente', bgColor: '#ffffff', textColor: '#000000' };
    if (type === 'video') newBlock.config = { title: 'Assista agora', videoId: '', bgColor: '#000000' };
    
    this.pbState.blocks.push(newBlock);
    document.getElementById('pb-add-block-modal').style.display = 'none';
    this.pbRenderSidebar();
    this.pbRenderPreview();
};

app.pbEditBlock = function(id) {
    this.pbState.editingBlockId = id;
    const block = this.pbState.blocks.find(b => b.id === id);
    if (!block) return;
    
    const modal = document.getElementById('pb-edit-block-modal');
    const form = document.getElementById('pb-edit-form');
    document.getElementById('pb-edit-title').innerText = `Editar ${block.type.toUpperCase()}`;
    
    let html = '';
    const c = block.config;
    
    if (block.type === 'hero') {
        html += this.pbInput('title', 'Título', c.title);
        html += this.pbInput('subtitle', 'Subtítulo', c.subtitle);
        html += this.pbInput('ctaText', 'Texto do Botão', c.ctaText);
        html += this.pbColor('bgColor', 'Cor de Fundo', c.bgColor);
        html += this.pbColor('textColor', 'Cor do Texto', c.textColor);
        html += this.pbColor('ctaColor', 'Cor do Botão', c.ctaColor);
    } else if (block.type === 'features') {
        html += this.pbInput('title', 'Título', c.title);
        html += this.pbTextarea('items', 'Itens (um por linha)', c.items);
        html += this.pbColor('bgColor', 'Cor de Fundo', c.bgColor);
        html += this.pbColor('textColor', 'Cor do Texto', c.textColor);
    } else if (block.type === 'testimonial') {
        html += this.pbTextarea('text', 'Depoimento', c.text);
        html += this.pbInput('author', 'Nome', c.author);
        html += this.pbInput('role', 'Cargo', c.role);
        html += this.pbColor('bgColor', 'Cor de Fundo', c.bgColor);
        html += this.pbColor('textColor', 'Cor do Texto', c.textColor);
    } else if (block.type === 'video') {
        html += this.pbInput('title', 'Título', c.title);
        html += this.pbInput('videoId', 'ID do Youtube (ex: dQw4w9WgXcQ)', c.videoId);
        html += this.pbColor('bgColor', 'Cor de Fundo', c.bgColor);
    }
    
    form.innerHTML = html;
    modal.style.display = 'flex';
};

app.pbInput = (id, label, value) => `
    <div>
        <label style="font-size: 10px; font-weight: 900; color: #999; text-transform: uppercase;">${label}</label>
        <input type="text" id="pbf-${id}" value="${value || ''}" style="width: 100%; padding: 12px; border: 1px solid #eee; border-radius: 8px; margin-top: 4px; font-size: 13px; font-weight: 700; outline: none; font-family: inherit;">
    </div>
`;
app.pbTextarea = (id, label, value) => `
    <div>
        <label style="font-size: 10px; font-weight: 900; color: #999; text-transform: uppercase;">${label}</label>
        <textarea id="pbf-${id}" style="width: 100%; padding: 12px; border: 1px solid #eee; border-radius: 8px; margin-top: 4px; font-size: 13px; font-weight: 700; outline: none; min-height: 80px; font-family: inherit;">${value || ''}</textarea>
    </div>
`;
app.pbColor = (id, label, value) => `
    <div>
        <label style="font-size: 10px; font-weight: 900; color: #999; text-transform: uppercase;">${label}</label>
        <div style="display: flex; gap: 8px; margin-top: 4px;">
            <input type="color" id="pbf-${id}" value="${value || '#000000'}" style="width: 40px; height: 40px; border: none; border-radius: 8px; cursor: pointer;">
            <input type="text" value="${value || '#000000'}" readonly style="flex: 1; padding: 10px; border: 1px solid #eee; border-radius: 8px; font-size: 13px; font-weight: 700; background: #fafafa;">
        </div>
    </div>
`;

app.pbSaveBlockEdit = function() {
    const block = this.pbState.blocks.find(b => b.id === this.pbState.editingBlockId);
    if (!block) return;
    
    if (block.type === 'hero') {
        block.config.title = document.getElementById('pbf-title').value;
        block.config.subtitle = document.getElementById('pbf-subtitle').value;
        block.config.ctaText = document.getElementById('pbf-ctaText').value;
        block.config.bgColor = document.getElementById('pbf-bgColor').value;
        block.config.textColor = document.getElementById('pbf-textColor').value;
        block.config.ctaColor = document.getElementById('pbf-ctaColor').value;
    } else if (block.type === 'features') {
        block.config.title = document.getElementById('pbf-title').value;
        block.config.items = document.getElementById('pbf-items').value;
        block.config.bgColor = document.getElementById('pbf-bgColor').value;
        block.config.textColor = document.getElementById('pbf-textColor').value;
    } else if (block.type === 'testimonial') {
        block.config.text = document.getElementById('pbf-text').value;
        block.config.author = document.getElementById('pbf-author').value;
        block.config.role = document.getElementById('pbf-role').value;
        block.config.bgColor = document.getElementById('pbf-bgColor').value;
        block.config.textColor = document.getElementById('pbf-textColor').value;
    } else if (block.type === 'video') {
        block.config.title = document.getElementById('pbf-title').value;
        block.config.videoId = document.getElementById('pbf-videoId').value;
        block.config.bgColor = document.getElementById('pbf-bgColor').value;
    }
    
    document.getElementById('pb-edit-block-modal').style.display = 'none';
    this.pbRenderPreview();
};

app.pbRenderPreview = function() {
    const frame = document.getElementById('pb-preview-frame');
    if (!frame) return;
    
    frame.innerHTML = this.pbState.blocks.map(block => this.pbRenderBlockHTML(block)).join('');
    
    // Add fake footer for editor visualization
    frame.innerHTML += `<div style="padding: 40px; text-align: center; color: #ccc; font-size: 12px;">Fim da Página</div>`;
};

app.pbRenderBlockHTML = function(block, isLive = false) {
    const c = block.config;
    // Helper to generate CTA click depending on context
    const ctaClick = isLive ? `app.navigateCheckout('${this.pbState?.productId || ''}')` : `alert('Redireciona para Checkout no Live')`;
    
    if (block.type === 'hero') {
        return `
            <div style="padding: 80px 24px; text-align: center; background: ${c.bgColor || '#fff'}; color: ${c.textColor || '#000'};">
                <h1 style="font-size: clamp(32px, 5vw, 56px); font-weight: 950; letter-spacing: -2px; margin-bottom: 24px; line-height: 1.1;">${c.title}</h1>
                <p style="font-size: clamp(16px, 3vw, 20px); font-weight: 500; opacity: 0.8; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.5;">${c.subtitle}</p>
                <button onclick="${ctaClick}" style="background: ${c.ctaColor || '#10b981'}; color: #fff; border: none; padding: 20px 48px; border-radius: 50px; font-size: 18px; font-weight: 950; cursor: pointer; box-shadow: 0 10px 30px ${c.ctaColor}40; transition: 0.3s; text-transform: uppercase; letter-spacing: 1px;">${c.ctaText}</button>
            </div>
        `;
    }
    if (block.type === 'features') {
        const itemsList = (c.items || '').split('\\n').filter(i => i.trim());
        return `
            <div style="padding: 80px 24px; background: ${c.bgColor || '#f9f9f9'};">
                <h2 style="text-align: center; font-size: clamp(28px, 4vw, 40px); font-weight: 950; margin-bottom: 48px; color: ${c.textColor || '#000'}; letter-spacing: -1px;">${c.title || 'Benefícios'}</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 1000px; margin: 0 auto;">
                    ${itemsList.map(i => `
                        <div style="background: #fff; padding: 32px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); display: flex; flex-direction: column; align-items: flex-start;">
                            <div style="width: 48px; height: 48px; background: #10b981; color: #fff; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-weight: 900; font-size: 20px;">✓</div>
                            <h3 style="font-weight: 900; font-size: 18px; color: #000; line-height: 1.4;">${i}</h3>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    if (block.type === 'testimonial') {
        return `
            <div style="padding: 80px 24px; text-align: center; background: ${c.bgColor || '#fff'};">
                <div style="max-width: 800px; margin: 0 auto;">
                    <div style="color: #f59e0b; font-size: 24px; margin-bottom: 24px;">★★★★★</div>
                    <p style="font-size: clamp(20px, 4vw, 32px); font-weight: 800; font-style: italic; margin: 0 auto 32px; color: ${c.textColor || '#000'}; line-height: 1.4; letter-spacing: -0.5px;">"${c.text || 'Este produto mudou minha vida!'}"</p>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 16px;">
                        <div style="width: 56px; height: 56px; background: #eee; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 2px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        <div style="text-align: left;">
                            <p style="font-weight: 950; font-size: 16px; color: ${c.textColor || '#000'}; margin: 0;">${c.author || 'Maria Silva'}</p>
                            <p style="font-weight: 700; font-size: 12px; color: #888; margin: 0;">${c.role || 'Aluna'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    if (block.type === 'video') {
         return `
            <div style="padding: 80px 24px; text-align: center; background: ${c.bgColor || '#000'};">
                <h2 style="font-size: clamp(28px, 4vw, 40px); font-weight: 950; margin-bottom: 40px; color: #fff; letter-spacing: -1px;">${c.title || 'Assista ao Vídeo'}</h2>
                <div style="max-width: 900px; margin: 0 auto; aspect-ratio: 16/9; background: #111; border-radius: 24px; display: flex; align-items: center; justify-content: center; color: #fff; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                    ${c.videoId ? `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${c.videoId}" frameborder="0" allowfullscreen style="border:none;"></iframe>` : '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.3"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>'}
                </div>
            </div>
         `;
    }
    return `<div>Unknown block</div>`;
};

app.pbSavePage = function() {
    const data = {
        slug: this.pbState.slug,
        blocks: this.pbState.blocks,
        productId: this.pbState.productId
    };
    
    // Save to local storage for now (MVP)
    localStorage.setItem(`dito_pb_${this.pbState.productId}`, JSON.stringify(data));
    
    // Save globally accessible map of slug -> productId
    const routesMap = JSON.parse(localStorage.getItem('dito_pb_routes') || '{}');
    routesMap[this.pbState.slug] = this.pbState.productId;
    localStorage.setItem('dito_pb_routes', JSON.stringify(routesMap));
    
    this.showNotification("Página Salva com sucesso!", "success");
};

// Route handler for '?p=slug'
app.checkSalesPageRoute = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('p');
    if (slug) {
        const routesMap = JSON.parse(localStorage.getItem('dito_pb_routes') || '{}');
        const productId = routesMap[slug];
        if (productId) {
            this.pbState.productId = productId;
            this.navigate('sales-page');
            return true;
        }
    }
    return false;
};

app.renderSalesPage = function() {
    const container = document.getElementById('app-container');
    const tpl = document.getElementById('template-sales-page');
    if (!tpl) return;
    
    container.innerHTML = '';
    container.appendChild(tpl.content.cloneNode(true));
    
    const spContainer = document.getElementById('sp-container');
    const savedData = localStorage.getItem(`dito_pb_${this.pbState.productId}`);
    
    if (savedData) {
        const data = JSON.parse(savedData);
        this.pbState.blocks = data.blocks || [];
        spContainer.innerHTML = this.pbState.blocks.map(block => this.pbRenderBlockHTML(block, true)).join('');
        
        const product = this.products?.find(p => String(p.id) === String(this.pbState.productId));
        if (product) {
            document.title = product.name + ' | Oferta Exclusiva';
        }

        // Show sticky CTA
        const sticky = document.getElementById('sp-sticky-cta');
        if (sticky) {
            const product = this.products.find(p => String(p.id) === String(this.pbState.productId));
            if (product) {
                document.getElementById('sp-sticky-title').innerText = product.name;
                document.getElementById('sp-sticky-price').innerText = `R$ ${parseFloat(product.price).toFixed(2)}`;
                document.getElementById('sp-sticky-btn').onclick = () => this.navigateCheckout(this.pbState.productId);
                sticky.style.display = 'flex';
            }
        }
    } else {
        spContainer.innerHTML = '<div style="padding: 100px; text-align: center; font-weight: 900; font-size: 24px;">Página não encontrada</div>';
    }
};

app.navigateCheckout = function(productId) {
    // Clear URL params visually but stay in checkout flow
    window.history.pushState({}, document.title, window.location.pathname);
    this.selectedProduct = this.products.find(p => String(p.id) === String(productId));
    this.navigate('checkout-direto');
};
