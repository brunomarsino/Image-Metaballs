function initCustomGui() {
    console.log("initCustomGui called in script.js.");
    console.log("Value of window.appInterface.settings at start of initCustomGui:", JSON.stringify(window.appInterface.settings)); // Log content
    if (window.appInterface && window.appInterface.settings) {
        console.log("window.appInterface.settings.currentPaletteName at start of initCustomGui:", window.appInterface.settings.currentPaletteName);
    }

    // Check if p5 and its functions are available -- REMOVED, will be called when ready.
    // if (typeof window.p5Functions === 'undefined' || typeof window.settings === 'undefined') {
    //     console.error("p5Functions or settings not found on window. Ensure animation.html script runs first and defines these.");
    //     alert("Critical error: p5.js interface not loaded. GUI cannot function.");
    //     return;
    // }

    // --- DOM Element References ---
    const guiContainer = document.getElementById('custom-gui-container');
    const guiPanelToggle = document.getElementById('toggle-gui-panel');
    const guiContent = document.querySelector('.gui-content');
    const themeToggleButton = document.getElementById('themeToggleButton');

    // General Settings
    const numBallsSlider = document.getElementById('numBalls');
    const numBallsValueDisplay = document.getElementById('numBallsValue');
    const ballShapeSelect = document.getElementById('ballShape');
    const speedMultiplierSlider = document.getElementById('speedMultiplier');
    const speedMultiplierValueDisplay = document.getElementById('speedMultiplierValue');
    const imageFolderInput = document.getElementById('imageFolderInput'); // Already handled by p5's event listener
    const imageStatusDisplay = document.getElementById('imageStatus');
    const backgroundColorPicker = document.getElementById('backgroundColor');
    const resetSimulationButton = document.getElementById('resetSimulationButton');
    const clearImagesButton = document.getElementById('clearImagesButton');

    // Appearance & Effects
    const blurRadiusSlider = document.getElementById('blurRadius');
    const blurRadiusValueDisplay = document.getElementById('blurRadiusValue');
    const alphaThresholdSlider = document.getElementById('alphaThreshold');
    const alphaThresholdValueDisplay = document.getElementById('alphaThresholdValue');
    const imageEdgeFeatherSlider = document.getElementById('imageEdgeFeather');
    const imageEdgeFeatherValueDisplay = document.getElementById('imageEdgeFeatherValue');
    const imageMaskBlurSlider = document.getElementById('imageMaskBlur');
    const imageMaskBlurValueDisplay = document.getElementById('imageMaskBlurValue');
    const cornerRadiusSlider = document.getElementById('cornerRadius');
    const cornerRadiusValueDisplay = document.getElementById('cornerRadiusValue');
    const colorPaletteSelect = document.getElementById('colorPalette');
    const randomPaletteButton = document.getElementById('randomPaletteButton');

    // Physics & Interaction
    const shapeOscillationStrengthSlider = document.getElementById('shapeOscillationStrength');
    const shapeOscillationStrengthValueDisplay = document.getElementById('shapeOscillationStrengthValue');
    const collisionSquashDurationSlider = document.getElementById('collisionSquashDuration');
    const collisionSquashDurationValueDisplay = document.getElementById('collisionSquashDurationValue');
    const collisionReboundSettleTimeSlider = document.getElementById('collisionReboundSettleTime');
    const collisionReboundSettleTimeValueDisplay = document.getElementById('collisionReboundSettleTimeValue');
    const collisionReboundOvershootSlider = document.getElementById('collisionReboundOvershoot');
    const collisionReboundOvershootValueDisplay = document.getElementById('collisionReboundOvershootValue');
    const collisionReboundDampingSlider = document.getElementById('collisionReboundDamping');
    const collisionReboundDampingValueDisplay = document.getElementById('collisionReboundDampingValue');
    const collisionMinDeformSlider = document.getElementById('collisionMinDeform');
    const collisionMinDeformValueDisplay = document.getElementById('collisionMinDeformValue');
    const collisionMaxDeformSlider = document.getElementById('collisionMaxDeform');
    const collisionMaxDeformValueDisplay = document.getElementById('collisionMaxDeformValue');
    
    // Ball Size & Distribution
    const randomizeBallRadiiCheckbox = document.getElementById('randomizeBallRadii');
    const minRadiusFactorSlider = document.getElementById('minRadiusFactor');
    const minRadiusFactorValueDisplay = document.getElementById('minRadiusFactorValue');
    const maxRadiusFactorSlider = document.getElementById('maxRadiusFactor');
    const maxRadiusFactorValueDisplay = document.getElementById('maxRadiusFactorValue');


    // Presets - Updated references
    const presetManagerSelect = document.getElementById('presetManagerSelect');
    const presetNameInput = document.getElementById('presetNameInput');
    const presetLoadButton = document.getElementById('presetLoadButton');
    const presetSaveUpdateButton = document.getElementById('presetSaveUpdateButton');
    const presetDeleteButton = document.getElementById('presetDeleteButton');

    // Recording
    const recordingDurationSelect = document.getElementById('recordingDuration');
    const startRecordingButton = document.getElementById('startRecordingButton');
    const recordingStatusP = document.getElementById('recordingStatus');


    // --- Helper Functions ---
    function updateSliderDisplay(slider, displayElement) {
        if (slider && displayElement) {
            displayElement.textContent = slider.value;
        }
    }

    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }
    
    function reProcessImagesAndMaybeBalls() {
        if (window.appInterface.settings.useImages && typeof window.appInterface.p5Functions.reProcessLoadedImagesAndReInitBalls === 'function') {
            window.appInterface.p5Functions.reProcessLoadedImagesAndReInitBalls();
        } else if (typeof window.appInterface.p5Functions.reProcessLoadedImages === 'function') {
            // Fallback if the combined function isn't there, just re-process
             window.appInterface.p5Functions.reProcessLoadedImages();
             if (typeof window.appInterface.settings.resetSimulation === 'function') {
                window.appInterface.settings.resetSimulation(); // Then re-initialize balls
            }
        } else if (typeof window.appInterface.settings.resetSimulation === 'function'){
             window.appInterface.settings.resetSimulation(); // If no images, just re-init balls for shape changes
        }
    }
    
    const debouncedImageReprocess = debounce(reProcessImagesAndMaybeBalls, 300);


    // --- GUI Interactivity ---

    // Panel Collapse/Expand
    if (guiPanelToggle && guiContent) {
        guiPanelToggle.addEventListener('click', () => {
            guiContent.classList.toggle('collapsed');
            guiPanelToggle.textContent = guiContent.classList.contains('collapsed') ? '+' : '-';
        });
    }

    // Section Collapse/Expand
    document.querySelectorAll('.gui-section-header').forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('collapsed');
            const content = header.nextElementSibling;
            if (content && content.classList.contains('gui-section-content')) {
                content.classList.toggle('collapsed');
            }
        });
        // Default to collapsed for some sections if desired, e.g.:
        // if (header.parentElement.querySelector('h3').textContent === "Physics & Interaction") {
        //     header.click();
        // }
    });

    // Theme Toggle
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('metaballsTheme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
            updateThemeButtonIcon();
        });
    }

    function updateThemeButtonIcon() {
        if (themeToggleButton) {
            themeToggleButton.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌓';
        }
    }

    function loadTheme() {
        const currentTheme = localStorage.getItem('metaballsTheme');
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode'); // Default to light
        }
        updateThemeButtonIcon();
    }


    // --- Control Wiring & Synchronization ---

    function updateShapeSpecificControlsVisibility() {
        const currentShape = window.appInterface.settings.ballShape;
        document.querySelectorAll('.image-shape-control').forEach(control => {
            control.style.display = 'none';
        });
        if (currentShape === 'circle') {
            document.querySelectorAll('.circle-control').forEach(c => c.style.display = 'flex');
        } else if (currentShape === 'roundedSquare') {
            document.querySelectorAll('.roundedSquare-control').forEach(c => c.style.display = 'flex');
        }
    }
    
    // General Settings
    if (numBallsSlider) {
        numBallsSlider.addEventListener('input', () => {
            updateSliderDisplay(numBallsSlider, numBallsValueDisplay);
            window.appInterface.settings.numBalls = parseInt(numBallsSlider.value, 10);
            if (window.appInterface.p5Functions && typeof window.appInterface.p5Functions.handleNumBallsChanged === 'function') {
                 window.appInterface.p5Functions.handleNumBallsChanged(window.appInterface.settings.numBalls);
            } else if (typeof window.appInterface.settings.resetSimulation === 'function') { // Fallback
                window.appInterface.settings.resetSimulation();
            }
        });
    }
    if (ballShapeSelect) {
        ballShapeSelect.addEventListener('change', () => {
            window.appInterface.settings.ballShape = ballShapeSelect.value;
            updateShapeSpecificControlsVisibility();
            // This requires re-processing images if they are used, and re-initializing balls
            reProcessImagesAndMaybeBalls();
        });
    }
    if (speedMultiplierSlider) {
        speedMultiplierSlider.addEventListener('input', () => {
            updateSliderDisplay(speedMultiplierSlider, speedMultiplierValueDisplay);
            window.appInterface.settings.speedMultiplier = parseFloat(speedMultiplierSlider.value);
            // p5 sketch reads this directly in ball.update()
        });
    }
    if (backgroundColorPicker) {
        backgroundColorPicker.addEventListener('input', () => {
            window.appInterface.settings.backgroundColor = backgroundColorPicker.value;
            if (window.appInterface.p5Functions && typeof window.appInterface.p5Functions.applyBackgroundColor === 'function') {
                window.appInterface.p5Functions.applyBackgroundColor(window.appInterface.settings.backgroundColor);
            }
        });
    }
    if (resetSimulationButton && window.appInterface && typeof window.appInterface.settings.resetSimulation === 'function') {
        resetSimulationButton.addEventListener('click', window.appInterface.settings.resetSimulation);
    }
    if (clearImagesButton && window.appInterface && typeof window.appInterface.settings.clearImages === 'function') {
        clearImagesButton.addEventListener('click', () => {
            window.appInterface.settings.clearImages();
            if(imageFolderInput) imageFolderInput.value = null; // Clear file input
            if(imageStatusDisplay) imageStatusDisplay.textContent = "Images cleared. Using colors.";
        });
    }
    
    // Appearance & Effects
    if (blurRadiusSlider) {
        blurRadiusSlider.addEventListener('input', () => {
            updateSliderDisplay(blurRadiusSlider, blurRadiusValueDisplay);
            window.appInterface.settings.blurRadius = parseInt(blurRadiusSlider.value, 10);
            // p5 sketch reads this directly in draw()
        });
    }
    if (alphaThresholdSlider) {
        alphaThresholdSlider.addEventListener('input', () => {
            updateSliderDisplay(alphaThresholdSlider, alphaThresholdValueDisplay);
            window.appInterface.settings.alphaThreshold = parseInt(alphaThresholdSlider.value, 10);
            // p5 sketch reads this directly in draw()
        });
    }

    if (imageEdgeFeatherSlider) {
        imageEdgeFeatherSlider.addEventListener('input', () => {
            updateSliderDisplay(imageEdgeFeatherSlider, imageEdgeFeatherValueDisplay);
            window.appInterface.settings.imageEdgeFeather = parseFloat(imageEdgeFeatherSlider.value);
            debouncedImageReprocess();
        });
    }
    if (imageMaskBlurSlider) {
        imageMaskBlurSlider.addEventListener('input', () => {
            updateSliderDisplay(imageMaskBlurSlider, imageMaskBlurValueDisplay);
            window.appInterface.settings.imageMaskBlur = parseInt(imageMaskBlurSlider.value, 10);
            debouncedImageReprocess();
        });
    }
    if (cornerRadiusSlider) {
        cornerRadiusSlider.addEventListener('input', () => {
            updateSliderDisplay(cornerRadiusSlider, cornerRadiusValueDisplay);
            window.appInterface.settings.cornerRadius = parseInt(cornerRadiusSlider.value, 10);
            debouncedImageReprocess();
        });
    }

    // Color Palettes
    if (colorPaletteSelect) {
        colorPaletteSelect.addEventListener('change', () => {
            const selectedPaletteName = colorPaletteSelect.value;
            if (window.appInterface.p5Functions && typeof window.appInterface.p5Functions.setActivePalette === 'function') {
                window.appInterface.p5Functions.setActivePalette(selectedPaletteName);
            }
        });
    }
    if (randomPaletteButton) {
        randomPaletteButton.addEventListener('click', () => {
            if (window.appInterface.p5Functions && typeof window.appInterface.p5Functions.generateAndAddNewPalette === 'function') {
                const newPaletteName = window.appInterface.p5Functions.generateAndAddNewPalette();
                if (newPaletteName) {
                    populateColorPaletteDropdown(); // Refresh dropdown
                    colorPaletteSelect.value = newPaletteName; // Select the new one
                    window.appInterface.p5Functions.setActivePalette(newPaletteName); // Apply it
                }
            }
        });
    }

    // Physics & Interaction
    if (shapeOscillationStrengthSlider) {
        shapeOscillationStrengthSlider.addEventListener('input', () => {
            updateSliderDisplay(shapeOscillationStrengthSlider, shapeOscillationStrengthValueDisplay);
            window.appInterface.settings.shapeOscillationStrength = parseFloat(shapeOscillationStrengthSlider.value);
        });
    }
    // Collision Deformation sliders
    const collisionSliders = [
        { slider: collisionSquashDurationSlider, display: collisionSquashDurationValueDisplay, setting: 'collisionSquashDuration', isFloat: false },
        { slider: collisionReboundSettleTimeSlider, display: collisionReboundSettleTimeValueDisplay, setting: 'collisionReboundSettleTime', isFloat: false },
        { slider: collisionReboundOvershootSlider, display: collisionReboundOvershootValueDisplay, setting: 'collisionReboundOvershoot', isFloat: true },
        { slider: collisionReboundDampingSlider, display: collisionReboundDampingValueDisplay, setting: 'collisionReboundDamping', isFloat: true },
        { slider: collisionMinDeformSlider, display: collisionMinDeformValueDisplay, setting: 'collisionMinDeform', isFloat: true },
        { slider: collisionMaxDeformSlider, display: collisionMaxDeformValueDisplay, setting: 'collisionMaxDeform', isFloat: true },
    ];
    collisionSliders.forEach(item => {
        if (item.slider) {
            item.slider.addEventListener('input', () => {
                updateSliderDisplay(item.slider, item.display);
                window.appInterface.settings[item.setting] = item.isFloat ? parseFloat(item.slider.value) : parseInt(item.slider.value, 10);
            });
        }
    });
    
    // Ball Size & Distribution
    if(randomizeBallRadiiCheckbox) {
        randomizeBallRadiiCheckbox.addEventListener('change', () => {
            window.appInterface.settings.randomizeBallRadii = randomizeBallRadiiCheckbox.checked;
            if (window.appInterface.settings.resetSimulation) window.appInterface.settings.resetSimulation();
        });
    }
    if(minRadiusFactorSlider){
        minRadiusFactorSlider.addEventListener('input', () => {
            updateSliderDisplay(minRadiusFactorSlider, minRadiusFactorValueDisplay);
            window.appInterface.settings.minRadiusFactor = parseFloat(minRadiusFactorSlider.value);
            if (parseFloat(minRadiusFactorSlider.value) > parseFloat(maxRadiusFactorSlider.value)) {
                maxRadiusFactorSlider.value = minRadiusFactorSlider.value;
                updateSliderDisplay(maxRadiusFactorSlider, maxRadiusFactorValueDisplay);
                window.appInterface.settings.maxRadiusFactor = parseFloat(maxRadiusFactorSlider.value);
            }
            if (window.appInterface.settings.resetSimulation) window.appInterface.settings.resetSimulation();
        });
    }
    if(maxRadiusFactorSlider){
        maxRadiusFactorSlider.addEventListener('input', () => {
            updateSliderDisplay(maxRadiusFactorSlider, maxRadiusFactorValueDisplay);
            window.appInterface.settings.maxRadiusFactor = parseFloat(maxRadiusFactorSlider.value);
             if (parseFloat(maxRadiusFactorSlider.value) < parseFloat(minRadiusFactorSlider.value)) {
                minRadiusFactorSlider.value = maxRadiusFactorSlider.value;
                updateSliderDisplay(minRadiusFactorSlider, minRadiusFactorValueDisplay);
                window.appInterface.settings.minRadiusFactor = parseFloat(minRadiusFactorSlider.value);
            }
            if (window.appInterface.settings.resetSimulation) window.appInterface.settings.resetSimulation();
        });
    }


    // --- Dynamic GUI Updates (Populating Dropdowns, etc.) ---

    function populateColorPaletteDropdown() {
        if (!colorPaletteSelect || !window.appInterface.p5Functions || typeof window.appInterface.p5Functions.getColorPalettes !== 'function') return;
        const palettes = window.appInterface.p5Functions.getColorPalettes();
        colorPaletteSelect.innerHTML = ''; // Clear existing options
        palettes.forEach(palette => {
            const option = document.createElement('option');
            option.value = palette.name;
            option.textContent = palette.name;
            colorPaletteSelect.appendChild(option);
        });
        
        console.log("In populateColorPaletteDropdown, about to access window.appInterface.settings.currentPaletteName. window.appInterface.settings is:", JSON.stringify(window.appInterface.settings));
        if (window.appInterface && typeof window.appInterface.settings.currentPaletteName !== 'undefined') {
            // Ensure the value actually exists as an option to prevent errors if a preset had a bogus palette name
            const currentPaletteIsValid = Array.from(colorPaletteSelect.options).some(opt => opt.value === window.appInterface.settings.currentPaletteName);
            if (currentPaletteIsValid) {
                colorPaletteSelect.value = window.appInterface.settings.currentPaletteName;
            } else if (palettes.length > 0) {
                console.warn(`populateColorPaletteDropdown: currentPaletteName "${window.appInterface.settings.currentPaletteName}" not found in options. Defaulting to first palette.`);
                colorPaletteSelect.value = palettes[0].name;
                window.appInterface.settings.currentPaletteName = palettes[0].name; // Sync back to settings
                 if (window.appInterface.p5Functions && typeof window.appInterface.p5Functions.setActivePalette === 'function') {
                    window.appInterface.p5Functions.setActivePalette(window.appInterface.settings.currentPaletteName); // Also update p5 side
                }
            } else {
                 console.warn("populateColorPaletteDropdown: No palettes available to select.");
            }
        } else {
            console.warn("populateColorPaletteDropdown: window.appInterface.settings or window.appInterface.settings.currentPaletteName is undefined/missing. Defaulting selection if possible.");
            if (palettes.length > 0) {
                colorPaletteSelect.value = palettes[0].name;
                 // If settings was totally undefined, we can't update it. 
                 // If only currentPaletteName was missing on an existing settings object:
                 if(window.appInterface.settings) { 
                    window.appInterface.settings.currentPaletteName = palettes[0].name; 
                    if (window.appInterface.p5Functions && typeof window.appInterface.p5Functions.setActivePalette === 'function') {
                        window.appInterface.p5Functions.setActivePalette(window.appInterface.settings.currentPaletteName);
                    }
                }
            } else {
                 console.warn("populateColorPaletteDropdown: No palettes available and settings.currentPaletteName missing.");
            }
        }
    }

    function populatePresetManagerDropdown() {
        if (!presetManagerSelect || !window.appInterface.p5Functions || typeof window.appInterface.p5Functions.getBuiltInPresets !== 'function') {
            console.error("Preset manager select or p5Functions not available for populating.");
            return;
        }

        const builtInPresets = window.appInterface.p5Functions.getBuiltInPresets() || [];
        const userPresets = JSON.parse(localStorage.getItem('metaballUserPresets_v1') || '{}');

        presetManagerSelect.innerHTML = ''; // Clear existing options

        // Add a placeholder/instructional option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = "";
        placeholderOption.textContent = "-- Select or Manage Preset --";
        placeholderOption.disabled = true;
        // placeholderOption.selected = true; // Select it initially
        presetManagerSelect.appendChild(placeholderOption);

        // Populate with Built-in Presets
        if (builtInPresets.length > 0) {
            const groupBuiltIn = document.createElement('optgroup');
            groupBuiltIn.label = "Built-in Presets";
            builtInPresets.forEach(preset => {
                if (preset.name === "-- Select Preset --" && preset.settings === null) return; // Skip the old placeholder
                const option = document.createElement('option');
                option.value = preset.name;
                option.textContent = preset.name; // No need to append (Built-in) here, optgroup serves that
                option.dataset.type = 'builtin'; // Custom data attribute
                groupBuiltIn.appendChild(option);
            });
            presetManagerSelect.appendChild(groupBuiltIn);
        }

        // Populate with User Presets
        if (Object.keys(userPresets).length > 0) {
            const groupUser = document.createElement('optgroup');
            groupUser.label = "User Presets";
            Object.keys(userPresets).forEach(presetName => {
                const option = document.createElement('option');
                option.value = presetName;
                option.textContent = presetName;
                option.dataset.type = 'user'; // Custom data attribute
                groupUser.appendChild(option);
            });
            presetManagerSelect.appendChild(groupUser);
        }
        
        // Set initial selection based on window.appInterface.settings.currentPresetName or default
        let currentPresetToSelect = "";
        if (window.appInterface && window.appInterface.settings.currentPresetName && window.appInterface.settings.currentPresetName !== "-- Select Preset --") {
            currentPresetToSelect = window.appInterface.settings.currentPresetName;
        }
        
        const optionExists = Array.from(presetManagerSelect.options).some(opt => opt.value === currentPresetToSelect);
        if(optionExists){
            presetManagerSelect.value = currentPresetToSelect;
        } else {
            presetManagerSelect.value = ""; // Default to placeholder if current not found or is the old placeholder
        }
    }

    function handlePresetSelectionChange() {
        if (!presetManagerSelect || !presetNameInput || !presetDeleteButton) return;

        const selectedOption = presetManagerSelect.options[presetManagerSelect.selectedIndex];
        if (!selectedOption || !selectedOption.value) { // No selection or placeholder
            presetNameInput.value = "";
            presetDeleteButton.disabled = true;
            return;
        }

        presetNameInput.value = selectedOption.value; // Pre-fill name input

        if (selectedOption.dataset.type === 'user') {
            presetDeleteButton.disabled = false;
        } else { // builtin or placeholder
            presetDeleteButton.disabled = true;
        }
    }

    // Preset Functionality - Event Listeners for new buttons
    if (presetManagerSelect) {
        presetManagerSelect.addEventListener('change', handlePresetSelectionChange);
    }

    if (presetLoadButton) {
        presetLoadButton.addEventListener('click', () => {
            const selectedOption = presetManagerSelect.options[presetManagerSelect.selectedIndex];
            if (selectedOption && selectedOption.value) {
                const presetName = selectedOption.value;
                if (window.appInterface.p5Functions && typeof window.appInterface.p5Functions.loadPreset === 'function') {
                    const success = window.appInterface.p5Functions.loadPreset(presetName);
                    if (success) {
                        // p5Functions.loadPreset calls customGuiUpdate.
                        // We need to ensure the dropdown itself is correctly re-populated and selection handled.
                        populatePresetManagerDropdown(); // This will re-select and trigger handlePresetSelectionChange
                        console.log("Preset loaded via button: ", presetName);
                    } else {
                        alert("Failed to load preset: " + presetName);
                    }
                }
            } else {
                alert("Please select a preset to load.");
            }
        });
    }

    if (presetSaveUpdateButton) {
        presetSaveUpdateButton.addEventListener('click', () => {
            const presetName = presetNameInput.value.trim();
            if (!presetName) {
                alert("Please enter a name for the preset.");
                return;
            }

            // Check if it's an existing user preset (for overwrite confirmation)
            let isExistingUserPreset = false;
            const userPresets = JSON.parse(localStorage.getItem('metaballUserPresets_v1') || '{}');
            if (userPresets.hasOwnProperty(presetName)) {
                isExistingUserPreset = true;
            }

            if (isExistingUserPreset) {
                if (!confirm(`A preset named '${presetName}' already exists. Overwrite it?`)) {
                    return; // User cancelled overwrite
                }
            }

            if (window.appInterface.p5Functions && typeof window.appInterface.p5Functions.saveUserPreset === 'function') {
                window.appInterface.p5Functions.saveUserPreset(presetName);
                populatePresetManagerDropdown(); // Refresh and re-select
                presetManagerSelect.value = presetName; // Explicitly select the saved one
                handlePresetSelectionChange(); // Update button states based on new selection
                alert(`Preset '${presetName}' saved!`);
            }
        });
    }

    if (presetDeleteButton) {
        presetDeleteButton.addEventListener('click', () => {
            const selectedOption = presetManagerSelect.options[presetManagerSelect.selectedIndex];
            if (selectedOption && selectedOption.value && selectedOption.dataset.type === 'user') {
                const presetName = selectedOption.value;
                if (confirm(`Are you sure you want to delete the preset '${presetName}'?`)) {
                    if (window.appInterface.p5Functions && typeof window.appInterface.p5Functions.deleteUserPreset === 'function') {
                        window.appInterface.p5Functions.deleteUserPreset(presetName);
                        populatePresetManagerDropdown(); // Refresh and re-select (will likely go to placeholder)
                        // handlePresetSelectionChange will be called by populatePresetManagerDropdown if a value is set
                        alert(`Preset '${presetName}' deleted.`);
                    }
                }
            } else {
                alert("Please select a user-defined preset to delete.");
            }
        });
    }

    // --- Recording Functionality ---
    if (recordingDurationSelect) {
        recordingDurationSelect.addEventListener('change', () => {
            window.appInterface.settings.recordingDurationSeconds = parseInt(recordingDurationSelect.value, 10);
        });
    }
    if (startRecordingButton) {
        startRecordingButton.addEventListener('click', () => {
            if (window.appInterface.settings.isRecording) {
                // Act as a stop button if already recording
                if (window.appInterface.p5Functions && typeof window.appInterface.p5Functions.stopRecording === 'function') {
                    window.appInterface.p5Functions.stopRecording(false); // false for user initiated stop
                }
            } else {
                if (window.appInterface.p5Functions && typeof window.appInterface.p5Functions.startRecording === 'function') {
                    window.appInterface.p5Functions.startRecording();
                }
            }
            updateRecordingButtonState();
        });
    }

    function updateRecordingButtonState() {
        if (!startRecordingButton) return;
        // Simplified logic as it's always PNGs now
        const isProcessingOrRecording = window.appInterface.settings.isRecording || 
                                      (window.appInterface.settings.recordingStatusMessage && 
                                       window.appInterface.settings.recordingStatusMessage.toLowerCase().includes('rec.'));

        if (isProcessingOrRecording) {
            startRecordingButton.textContent = window.appInterface.settings.isRecording ? 'Stop PNG Recording' : 'Processing PNGs...';
            startRecordingButton.disabled = window.appInterface.settings.isRecording; // Only disable if actively recording, not just processing message from stop
            startRecordingButton.style.backgroundColor = window.appInterface.settings.isRecording ? 'var(--control-bg-hover)' : 'var(--control-accent-bg)';
            startRecordingButton.style.cursor = window.appInterface.settings.isRecording ? 'not-allowed' : 'pointer';
            if (window.appInterface.settings.recordingStatusMessage.toLowerCase().includes('processing')) { // Covers the post-stop saving message if any
                 startRecordingButton.textContent = 'Processing PNGs...';
                 startRecordingButton.disabled = true;
                 startRecordingButton.style.cursor = 'not-allowed';
            }

        } else {
            startRecordingButton.textContent = 'Start PNG Sequence Recording'; // Updated button text
            startRecordingButton.disabled = false;
            startRecordingButton.style.backgroundColor = 'var(--control-accent-bg)';
            startRecordingButton.style.cursor = 'pointer';
        }
    }
    
    // Function for p5.js to call to update GUI recording status
    window.updateGuiRecordingStatus = (message) => {
        if (recordingStatusP) {
            recordingStatusP.textContent = message;
        }
        updateRecordingButtonState(); // Update button text too (e.g. on finish/stop)
    };
    // Link this to the p5Functions stub
    if (window.appInterface.p5Functions) {
        window.appInterface.p5Functions.updateRecordingStatusDisplay = window.updateGuiRecordingStatus;
    }


    // --- Master GUI Update Function ---
    // This function is called to sync all GUI controls with the current p5 settings object
    // It's also assigned to window.customGuiUpdate so p5functions can call it (e.g., after loading a preset)
    function updateGuiControlsFromSettings() {
        if (!window.appInterface.settings) {
            console.error("Cannot update GUI: window.appInterface.settings not found.");
            return;
        }

        // General Settings
        if (numBallsSlider) {
            numBallsSlider.value = window.appInterface.settings.numBalls;
            updateSliderDisplay(numBallsSlider, numBallsValueDisplay);
        }
        if (ballShapeSelect) ballShapeSelect.value = window.appInterface.settings.ballShape;
        if (speedMultiplierSlider) {
            speedMultiplierSlider.value = window.appInterface.settings.speedMultiplier;
            updateSliderDisplay(speedMultiplierSlider, speedMultiplierValueDisplay);
        }
        if (backgroundColorPicker) backgroundColorPicker.value = window.appInterface.settings.backgroundColor;
        
        // Appearance & Effects
        if (blurRadiusSlider) {
            blurRadiusSlider.value = window.appInterface.settings.blurRadius;
            updateSliderDisplay(blurRadiusSlider, blurRadiusValueDisplay);
        }
        if (alphaThresholdSlider) {
            alphaThresholdSlider.value = window.appInterface.settings.alphaThreshold;
            updateSliderDisplay(alphaThresholdSlider, alphaThresholdValueDisplay);
        }
        if (imageEdgeFeatherSlider) {
            imageEdgeFeatherSlider.value = window.appInterface.settings.imageEdgeFeather;
            updateSliderDisplay(imageEdgeFeatherSlider, imageEdgeFeatherValueDisplay);
        }
        if (imageMaskBlurSlider) {
            imageMaskBlurSlider.value = window.appInterface.settings.imageMaskBlur;
            updateSliderDisplay(imageMaskBlurSlider, imageMaskBlurValueDisplay);
        }
        if (cornerRadiusSlider) {
            cornerRadiusSlider.value = window.appInterface.settings.cornerRadius;
            updateSliderDisplay(cornerRadiusSlider, cornerRadiusValueDisplay);
        }
        updateShapeSpecificControlsVisibility(); // After ballShape and its dependent controls are set

        // Physics & Interaction
        if (shapeOscillationStrengthSlider) {
            shapeOscillationStrengthSlider.value = window.appInterface.settings.shapeOscillationStrength;
            updateSliderDisplay(shapeOscillationStrengthSlider, shapeOscillationStrengthValueDisplay);
        }
        collisionSliders.forEach(item => {
            if (item.slider && window.appInterface.settings.hasOwnProperty(item.setting)) {
                item.slider.value = window.appInterface.settings[item.setting];
                updateSliderDisplay(item.slider, item.display);
            }
        });
        
        // Ball Size & Distribution
        if(randomizeBallRadiiCheckbox) randomizeBallRadiiCheckbox.checked = window.appInterface.settings.randomizeBallRadii;
        if(minRadiusFactorSlider) {
            minRadiusFactorSlider.value = window.appInterface.settings.minRadiusFactor;
            updateSliderDisplay(minRadiusFactorSlider, minRadiusFactorValueDisplay);
        }
        if(maxRadiusFactorSlider) {
            maxRadiusFactorSlider.value = window.appInterface.settings.maxRadiusFactor;
            updateSliderDisplay(maxRadiusFactorSlider, maxRadiusFactorValueDisplay);
        }

        // Palettes & Presets (dropdowns populated at init and on change)
        if (colorPaletteSelect) colorPaletteSelect.value = window.appInterface.settings.currentPaletteName;
        if (presetManagerSelect) presetManagerSelect.value = window.appInterface.settings.currentPresetName;
        if (presetNameInput) presetNameInput.value = window.appInterface.settings.newPresetName || "My Preset";

        // Recording
        if (recordingDurationSelect && window.appInterface.settings) recordingDurationSelect.value = window.appInterface.settings.recordingDurationSeconds;
        if (recordingStatusP && window.appInterface.settings) recordingStatusP.textContent = window.appInterface.settings.recordingStatusMessage || "Idle";
        updateRecordingButtonState();


        console.log("Custom GUI controls updated from settings.");
    }
    window.customGuiUpdate = updateGuiControlsFromSettings; // Make it globally accessible


    // --- Initial Setup Calls ---
    loadTheme();
    populateColorPaletteDropdown();
    populatePresetManagerDropdown();
    updateGuiControlsFromSettings(); // Initialize GUI with current settings

    // Initial check for image status (if p5.js already loaded images before this script)
    if (window.appInterface && window.appInterface.settings && window.appInterface.settings.useImages && loadedImages && loadedImages.length > 0) {
        if(imageStatusDisplay) imageStatusDisplay.textContent = `${loadedImages.length} images loaded.`;
    } else if (imageStatusDisplay) {
        const currentImageStatus = document.getElementById('imageStatus');
        if(currentImageStatus && currentImageStatus.textContent.includes("Loading")) {
            // Keep loading message
        } else {
             imageStatusDisplay.textContent = "No images loaded. Using colors.";
        }
    }
    
    console.log("Custom GUI script initialized.");
}

window.initCustomGui = initCustomGui;

// Helper to get raw loaded images from p5 sketch (if needed by GUI, though mostly p5 handles it)
// function getRawLoadedImagesFromP5() {
//     if (window.p5 && typeof window.getRawImages === 'function') { // Assuming getRawImages is exposed
//         return window.getRawImages();
//     }
//     return [];
// }

// Function to update recording controls display based on format
// function updateRecordingControlsDisplay(format) {
//     if (!durationControlContainer || !fixedFormatInfoContainer) {
//         console.warn("Recording control containers not found for display update.");
//         return;
//     }
//     if (format === 'webm' || format === 'gif') {
//         durationControlContainer.style.display = 'none';
//         fixedFormatInfoContainer.style.display = 'block';
//     } else { // png or any other case
//         durationControlContainer.style.display = 'block';
//         fixedFormatInfoContainer.style.display = 'none';
//     }
// }
