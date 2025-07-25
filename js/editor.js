document.getElementById('toggle-explorador').addEventListener('click', () => {
  const painel = document.getElementById('painel-explorador');
  painel.classList.toggle('oculto');
});


// editorLogic.js

// Instâncias do CodeMirror
const cmHtml = CodeMirror(document.getElementById('cm-html'), {
  mode: 'htmlmixed', // ou css/javascript/etc
  theme: 'material',
  lineNumbers: true,
  autoCloseTags: true,
  autoCloseBrackets: true,
  matchTags: { bothTags: true },
  indentUnit: 2,              // Quantos espaços por nível de indentação
  smartIndent: true,          // Ativa indentação inteligente
  tabSize: 2,                 // Tamanho visual do Tab
  indentWithTabs: false,      // Usa espaços ao invés de tabs
  extraKeys: {
    'Tab': function(cm) {
      if (cm.somethingSelected()) {
        cm.indentSelection('add'); // Indenta seleção se houver
      } else {
        cm.replaceSelection('  ', 'end'); // Espaços como tab
      }
    },
    'Shift-Tab': 'indentLess' // Desindenta
  }
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


// Exibe ou oculta o container do Preview e video

document.addEventListener('DOMContentLoaded', () => {
    const mainWorkspace = document.querySelector('.main-workspace'); // Se precisar ajustar o layout pai
    const editorPlayerPreviewArea = document.querySelector('.editor-player-preview-area'); // O pai do editor, resizer e player/preview
    const playerAndPreviewContainer = document.querySelector('.player-and-preview-container');
    const resizerVertical = document.getElementById('resizer'); // O resizer

    const btnPreview = document.getElementById('btn-preview');
    const abrirPlayerBtn = document.getElementById('abrirPlayer');
    const fecharPlayerBtn = document.getElementById('fechar');
    const closePreviewBtn = document.getElementById('close-preview');

    const playerVideo = document.getElementById('player-video');
    const previewEditor = document.querySelector('.preview-editor');

    // Função para atualizar o estado do layout (editor 100% ou dividido)
    function updateLayoutState() {
        // Se o playerAndPreviewContainer está oculto E o playerVideo e previewEditor também estão ocultos
        if (playerAndPreviewContainer.classList.contains('oculto')) {
            editorPlayerPreviewArea.classList.add('preview-hidden'); // Editor ocupa 100%
        } else {
            editorPlayerPreviewArea.classList.remove('preview-hidden'); // Layout dividido
        }
    }

    // Inicialmente, ocultar tudo e atualizar o layout
    playerAndPreviewContainer.classList.add('oculto');
    playerVideo.classList.add('oculto');
    previewEditor.classList.add('oculto');
    updateLayoutState(); // Chama para definir o estado inicial (editor 100%)

    // Função para mostrar o container principal e o elemento específico
    function showPanel(panelToShow) {
        playerAndPreviewContainer.classList.remove('oculto'); // Mostra o container pai
        playerVideo.classList.add('oculto');
        previewEditor.classList.add('oculto');

        if (panelToShow === 'player') {
            playerVideo.classList.remove('oculto');
        } else if (panelToShow === 'preview') {
            previewEditor.classList.remove('oculto');
        }
        updateLayoutState(); // Atualiza o layout após mostrar um painel
    }

    // Função para ocultar tudo
    function hideAllPanels() {
        playerVideo.classList.add('oculto');
        previewEditor.classList.add('oculto');
        playerAndPreviewContainer.classList.add('oculto'); // Oculta o container pai
        updateLayoutState(); // Atualiza o layout após ocultar tudo
    }

    // Event listeners
    if (btnPreview) {
        btnPreview.addEventListener('click', () => {
            showPanel('preview');
        });
    }

    if (abrirPlayerBtn) {
        abrirPlayerBtn.addEventListener('click', () => {
            showPanel('player');
        });
    }

    if (fecharPlayerBtn) {
        fecharPlayerBtn.addEventListener('click', () => {
            hideAllPanels();
        });
    }

    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', () => {
            hideAllPanels();
        });
    }

    // Se tiver lógica para o botão de layout, certifique-se de chamar updateLayoutState()
    const layoutBtn = document.getElementById('layout');
    if (layoutBtn) {
        layoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Sua lógica de layout aqui.
            // Exemplo: se você tem um toggle para o preview,
            // chame showPanel('preview') ou hideAllPanels() e updateLayoutState().
        });
    }
});




// Fecha o preview se clicar no X
document.getElementById('close-preview').addEventListener('click', () => {
  document.querySelector('.preview-editor').style.display = 'none';
});







document.addEventListener('DOMContentLoaded', function() {
    const resizer = document.getElementById('resizer');
    const editorArea = document.querySelector('.editor-area');
    const previewArea = document.querySelector('.preview-editor');
    const container = document.querySelector('.main-workspace');

    let isResizing = false;
    let startX, startEditorWidth, startPreviewWidth;

    resizer.addEventListener('mousedown', function(e) {
        isResizing = true;
        startX = e.clientX;
        startEditorWidth = editorArea.offsetWidth;
        startPreviewWidth = previewArea.offsetWidth;
        
        // Estilos durante o redimensionamento
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        
        // Adiciona listeners temporários
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        e.preventDefault();
    });

    function handleMouseMove(e) {
        if (!isResizing) return;
        
        // Calcula a nova largura
        const moveX = e.clientX - startX;
        let newEditorWidth = startEditorWidth + moveX;
        let newPreviewWidth = startPreviewWidth - moveX;
        
        // Define limites mínimos (em pixels)
        const minWidth = 200; // 200px mínimo para cada painel
        
        // Aplica os limites
        if (newEditorWidth < minWidth) {
            newEditorWidth = minWidth;
            newPreviewWidth = container.offsetWidth - minWidth - resizer.offsetWidth;
        }
        
        if (newPreviewWidth < minWidth) {
            newPreviewWidth = minWidth;
            newEditorWidth = container.offsetWidth - minWidth - resizer.offsetWidth;
        }
        
        // Aplica as novas dimensões
        editorArea.style.width = `${newEditorWidth}px`;
        previewArea.style.width = `${newPreviewWidth}px`;
    }

    function handleMouseUp() {
        if (!isResizing) return;
        
        isResizing = false;
        
        // Restaura estilos
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        
        // Remove listeners temporários
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    // Fallback para quando o mouse sai da janela
    window.addEventListener('blur', handleMouseUp);
});


const abrirPlayer = document.getElementById("abrirPlayer");
const fecharPlayer = document.getElementById("fechar");
const player = document.getElementById("player-video");

abrirPlayer.addEventListener("click", () => {
  player.classList.remove("oculto");
});

fecharPlayer.addEventListener("click", () => {
  player.classList.add("oculto");
});

document.addEventListener('DOMContentLoaded', function() {
    const videoFrame = document.getElementById('video-frame');
    const videoUrlInput = document.getElementById('video-url');
    const carregarBtn = document.getElementById('carregar-video');
    const playPauseBtn = document.getElementById('play-pause');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    
    // Variável para o player do YouTube (se aplicável)
    let player;
    
    // Carregar vídeo
    carregarBtn.addEventListener('click', function() {
        const url = videoUrlInput.value.trim();
        if (!url) return;
        
        // Resetar controles
        playIcon.classList.remove('oculto');
        pauseIcon.classList.add('oculto');
        
        // Verifica se é YouTube
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            let videoId = '';
            
            if (url.includes('v=')) {
                videoId = url.split('v=')[1].split('&')[0];
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1].split('?')[0];
            }
            
            if (videoId) {
                videoFrame.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
                // Carrega a API do YouTube se ainda não estiver carregada
                if (!window.YT) {
                    const tag = document.createElement('script');
                    tag.src = "https://www.youtube.com/iframe_api";
                    document.body.appendChild(tag);
                }
            }
        } else {
            // Para outras fontes de vídeo
            videoFrame.src = url;
        }
    });
    
    // Função para quando a API do YouTube estiver pronta
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('video-frame', {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };
    
    function onPlayerReady(event) {
        // Configura os eventos de controle para o YouTube
        setupYouTubeControls();
    }
    
    function onPlayerStateChange(event) {
        // Atualiza os ícones de play/pause conforme o estado do player
        if (event.data === YT.PlayerState.PLAYING) {
            playIcon.classList.add('oculto');
            pauseIcon.classList.remove('oculto');
        } else {
            playIcon.classList.remove('oculto');
            pauseIcon.classList.add('oculto');
        }
    }
    
    function setupYouTubeControls() {
        playPauseBtn.addEventListener('click', function() {
            if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
        });
        
        document.getElementById('voltar').addEventListener('click', function() {
            player.seekTo(player.getCurrentTime() - 10, true);
        });
        
        document.getElementById('avancar').addEventListener('click', function() {
            player.seekTo(player.getCurrentTime() + 10, true);
        });
    }
    
    // Controle genérico de play/pause para não-YouTube
    playPauseBtn.addEventListener('click', function() {
        if (!player) {
            try {
                const iframe = videoFrame.contentWindow;
                // Tentativa genérica de controlar o vídeo
                iframe.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                playIcon.classList.toggle('oculto');
                pauseIcon.classList.toggle('oculto');
            } catch(e) {
                console.error("Controle não suportado para este tipo de vídeo");
            }
        }
    });
    
    // Controles genéricos de voltar/avançar (pode não funcionar para todos os vídeos)
    document.getElementById('voltar').addEventListener('click', function() {
        if (!player) {
            try {
                videoFrame.contentWindow.postMessage('{"event":"command","func":"seekTo","args":[currentTime-10]}', '*');
            } catch(e) {
                console.error("Controle não suportado");
            }
        }
    });
    
    document.getElementById('avancar').addEventListener('click', function() {
        if (!player) {
            try {
                videoFrame.contentWindow.postMessage('{"event":"command","func":"seekTo","args":[currentTime+10]}', '*');
            } catch(e) {
                console.error("Controle não suportado");
            }
        }
    });
});






