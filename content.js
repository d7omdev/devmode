(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDevHelper);
    } else {
        initDevHelper();
    }

    let state = {
        borderVisible: true,
        gridVisible: false,
        bannerLocked: false
    };

    function initDevHelper() {
        const banner = document.createElement('div');
        banner.id = 'dev-helper-banner';

        const viewportBorder = document.createElement('div');
        viewportBorder.id = 'dev-helper-viewport-border';
        viewportBorder.style.display = 'block';

        const gridOverlay = document.createElement('div');
        gridOverlay.id = 'dev-helper-grid-overlay';
        gridOverlay.style.display = 'none';

        const message = document.createElement('span');
        message.textContent = 'Dev Mode';
        banner.appendChild(message);

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'dev-helper-buttons';
        banner.appendChild(buttonContainer);

        addButton(buttonContainer, 'Clear Cache', function () {
            window.location.reload(true);
        });

        addButton(buttonContainer, 'Toggle Border', function () {
            state.borderVisible = !state.borderVisible;
            viewportBorder.style.display = state.borderVisible ? 'block' : 'none';
            this.classList.toggle('active', state.borderVisible);
        }, true);

        addButton(buttonContainer, 'Toggle Grid', function () {
            state.gridVisible = !state.gridVisible;
            gridOverlay.style.display = state.gridVisible ? 'block' : 'none';
            this.classList.toggle('active', state.gridVisible);
        });

        addButton(buttonContainer, 'View Storage', function () {
            if (localStorage.length === 0) {
                alert('📦 Local storage is empty.');
                return;
            }

            const storageData = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                storageData[key] = localStorage.getItem(key);
            }

            const jsonFormatted = JSON.stringify(storageData, null, 4);

            const modal = document.createElement('div');
            modal.id = 'storageModal';

            if (typeof syntaxHighlight === 'function') {
                modal.innerHTML = `
                    <div id="modalContent">
                        <pre id="jsonContent">${syntaxHighlight(jsonFormatted)}</pre>
                        <button id="closeModal">Close</button>
                    </div>
                `;
            } else {
                console.error('syntaxHighlight function not found');
                modal.innerHTML = `
                    <div id="modalContent">
                        <pre id="jsonContent">${jsonFormatted}</pre>
                        <button id="closeModal">Close</button>
                    </div>
                `;
            }

            document.body.appendChild(modal);

            document.getElementById('closeModal').addEventListener('click', () => {
                modal.remove();
            });
        });

        addButton(buttonContainer, 'Lock Banner', function () {
            state.bannerLocked = !state.bannerLocked;
            banner.style.position = state.bannerLocked ? 'fixed' : 'absolute';
            banner.style.top = '0';
            banner.style.left = '0';

            this.classList.toggle('active', state.bannerLocked);
        });


        const dimensionsDisplay = document.createElement('div');
        dimensionsDisplay.id = 'dev-helper-dimensions';
        dimensionsDisplay.textContent = `${window.innerWidth}px × ${window.innerHeight}px`;
        buttonContainer.appendChild(dimensionsDisplay);

        const performanceDisplay = document.createElement('div');
        performanceDisplay.id = 'dev-helper-performance';
        performanceDisplay.innerHTML = 'FPS: <span>0</span>';
        buttonContainer.appendChild(performanceDisplay);

        let frameCount = 0;
        let lastTime = performance.now();
        let fps = 0;

        function updateFPS() {
            const now = performance.now();
            frameCount++;

            if (now - lastTime >= 1000) {
                fps = Math.round(frameCount * 1000 / (now - lastTime));
                frameCount = 0;
                lastTime = now;

                performanceDisplay.querySelector('span').textContent = `${fps}`;
                const color = fps < 30 ? 'red' : fps < 60 ? 'yellow' : 'lime';
                performanceDisplay.querySelector('span').style.color = color;
            }

            requestAnimationFrame(updateFPS);
        }


        requestAnimationFrame(updateFPS);


        window.addEventListener('resize', function () {
            dimensionsDisplay.textContent = `${window.innerWidth}px × ${window.innerHeight}px`;
        });

        document.body.appendChild(banner);
        document.body.appendChild(viewportBorder);
        document.body.appendChild(gridOverlay);

        document.addEventListener('mousemove', function (e) {
            if (!state.bannerLocked) {
                if (e.clientY < 10) {
                    banner.style.transform = 'translateY(0)';
                } else if (e.clientY > 60 && !banner.contains(e.target)) {
                    banner.style.transform = 'translateY(-100%)';
                }
            }
        });
    }

    function addButton(container, text, clickHandler, active) {
        const button = document.createElement('button');
        button.className = 'dev-helper-button';
        active && button.classList.add('active');
        button.textContent = text;
        button.addEventListener('click', clickHandler);
        container.appendChild(button);
        return button;
    }
})();
