document.getElementById('toggle-explorador').addEventListener('click', () => {
  const painel = document.getElementById('painel-explorador');
  painel.classList.toggle('oculto');
});


// editorLogic.js

// Instâncias do CodeMirror
const cmHtml = CodeMirror(document.getElementById('cm-html'), {
    mode: 'htmlmixed',
    theme: 'material',
    lineNumbers: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    matchTags: { bothTags: true },
    extraKeys: { 'Tab': 'autocomplete' }
});

const cmCss = CodeMirror(document.getElementById('cm-css'), {
    mode: 'css',
    theme: 'material',
    lineNumbers: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    matchTags: { bothTags: true },
    extraKeys: { 'Tab': 'autocomplete' }
});

const cmJs = CodeMirror(document.getElementById('cm-js'), {
    mode: 'javascript',
    theme: 'material',
    lineNumbers: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    matchTags: { bothTags: true },
    extraKeys: { 'Tab': 'autocomplete' }
});

// Mapeamento das instâncias por linguagem
const cmInstances = {
    html: cmHtml,
    css: cmCss,
    js: cmJs,
};

// Elementos visuais (wrappers dos editores)
const editors = {
    html: cmHtml.getWrapperElement(),
    css: cmCss.getWrapperElement(),
    js: cmJs.getWrapperElement(),
};

const tabs = document.querySelectorAll('.tabs li');

// --- FUNÇÕES DE SALVAMENTO AUTOMÁTICO ---

function saveCode() {
    localStorage.setItem('cmHtmlContent', cmHtml.getValue());
    localStorage.setItem('cmCssContent', cmCss.getValue());
    localStorage.setItem('cmJsContent', cmJs.getValue());
    console.log('Código salvo automaticamente!');
}

function loadCode() {
    const htmlContent = localStorage.getItem('cmHtmlContent');
    const cssContent = localStorage.getItem('cmCssContent');
    const jsContent = localStorage.getItem('cmJsContent');

    if (htmlContent !== null) {
        cmHtml.setValue(htmlContent);
    }
    if (cssContent !== null) {
        cmCss.setValue(cssContent);
    }
    if (jsContent !== null) {
        cmJs.setValue(jsContent);
    }
    updatePreview(); // Atualiza o preview após carregar o código
}

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

const debouncedSaveCode = debounce(saveCode, 1000);

// --- FUNÇÃO DE ATUALIZAÇÃO DO PREVIEW ---

function updatePreview() {
    const html = cmHtml.getValue();
    const css = cmCss.getValue();
    const js = cmJs.getValue();

    const iframe = document.querySelector('.preview-iframe');
    if (!iframe) {
        console.error('Elemento .preview-iframe não encontrado.');
        return;
    }

    // Importante: escape a tag de fechamento de script e style dentro do JS/HTML/CSS do usuário
    // para evitar que o navegador as interprete como tags de fechamento da sua página principal
    // ou que causem problemas dentro do iframe.
    const safeJs = js.replace(/<\/script>/g, '<\\u002Fscript>');
    const safeHtml = html.replace(/<\/script>/g, '<\\u002Fscript>'); // Garante que JS no HTML do usuário não vaze
    const safeCss = css.replace(/<\/style>/g, '<\\u002Fstyle>'); // Garante que CSS no CSS do usuário não vaze

    const iframeContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>${safeCss}</style>
        </head>
        <body>
            ${safeHtml}
            <script>${safeJs}</script>
        </body>
        </html>
    `;

    // Atribuir a srcdoc. Embora o JS externo ajude, o navegador ainda pode ser "paranóico"
    // sobre strings que parecem fechar o script (se for um HTML/JS complexo).
    // Este replace final é a última linha de defesa para o srcdoc.
    iframe.srcdoc = iframeContent.replace(/<\/script>/g, '<\\u002Fscript>');
}

// --- LÓGICA DE ATIVAÇÃO DE ABAS ---

function activateTab(tabEl) {
    const target = tabEl.dataset.tab;

    tabs.forEach(t => t.classList.toggle('active', t === tabEl));

    Object.entries(editors).forEach(([key, editorEl]) => {
        if (key === target) {
            editorEl.style.display = 'block';
            cmInstances[key].refresh();
            cmInstances[key].focus();
        } else {
            editorEl.style.display = 'none';
        }
    });

    updatePreview();
}

// --- EVENT LISTENERS ---

cmHtml.on('change', () => {
    updatePreview();
    debouncedSaveCode();
});
cmCss.on('change', () => {
    updatePreview();
    debouncedSaveCode();
});
cmJs.on('change', () => {
    updatePreview();
    debouncedSaveCode();
});

tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));
});


loadCode();

activateTab(document.querySelector('.tabs li.active') || tabs[0]);


document.getElementById('btn-preview').addEventListener('click', () => {
  const htmlCode = cmHtml.getValue();
  const cssCode = cmCss.getValue();
  const jsCode = cmJs.getValue();

  const previewIframe = document.querySelector('.preview-iframe');
  const previewDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;

  const fullPreview = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <style>${cssCode}</style>
    </head>
    <body>
      ${htmlCode}
      <script>${jsCode}<\/script>
    </body>
    </html>
  `;

  previewDoc.open();
  previewDoc.write(fullPreview);
  previewDoc.close();

  // Mostrar o preview (caso esteja oculto)
  document.querySelector('.preview-editor').style.display = 'block';
});

// Fecha o preview se clicar no X
document.getElementById('close-preview').addEventListener('click', () => {
  document.querySelector('.preview-editor').style.display = 'none';
});






