const BACKEND_BASE_URL = "http://localhost:5000";

// ------------------------------------------------------------------
// Add viewport meta tag with safe area support
// ------------------------------------------------------------------
const addViewportMetaTag = () => {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        document.head.appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover, interactive-widget=resizes-content';
};

// ------------------------------------------------------------------
// Apply safe area insets to iframe
// ------------------------------------------------------------------
const applySafeAreaInsets = () => {
    if (!iframe) return;
    
    iframe.style.paddingTop = "env(safe-area-inset-top, 0px)";
    iframe.style.paddingBottom = "env(safe-area-inset-bottom, 20px)";
    iframe.style.paddingLeft = "env(safe-area-inset-left, 0px)";
    iframe.style.paddingRight = "env(safe-area-inset-right, 0px)";
    iframe.style.boxSizing = "border-box";
};

// ------------------------------------------------------------------
// Remove safe area insets from iframe
// ------------------------------------------------------------------
const removeSafeAreaInsets = () => {
    if (!iframe) return;
    
    iframe.style.paddingTop = "0";
    iframe.style.paddingBottom = "0";
    iframe.style.paddingLeft = "0";
    iframe.style.paddingRight = "0";
};

// Call this at the start
addViewportMetaTag();

// ------------------------------------------------------------------
// DOM elements
// ------------------------------------------------------------------
const mainBox = document.createElement("div"),
    chatBoxTextdiv = document.createElement("div"),
    chatBoxTextContent = document.createElement("p"),
    chatBox = document.createElement("div"),
    chatBoxImage = document.createElement("img"),
    chatBoxCloseIcon = document.createElement("div"),
    chatBoxTextClose = document.createElement("div");

// mobile helper
const isMobile = () => window.innerWidth <= 480;
let isVoice = false;

// ------------------------------------------------------------------
// Helper: Get Correct Mobile Height (Fix for address bar issue)
// ------------------------------------------------------------------
const getMobileHeight = () => {
    return CSS.supports('height: 100dvh') ? '100dvh' : `${window.innerHeight}px`;
};

// ------------------------------------------------------------------
// Text bubble responsiveness (and hide on mobile)
// ------------------------------------------------------------------
const updateTextDivWidth = () => {
    if (isMobile()) {
        chatBoxTextdiv.style.display = "none";
        chatBoxTextdiv.style.fontSize = "12px";
        chatBoxTextdiv.style.minWidth = "50px";
        chatBoxTextdiv.style.maxWidth = "180px";
    } else {
        chatBoxTextdiv.style.minWidth = "50px";
        chatBoxTextdiv.style.maxWidth = "250px";
        chatBoxTextdiv.style.fontSize = "14px";
    }
};

setTimeout(updateTextDivWidth, 100);

// ------------------------------------------------------------------
// Main container
// ------------------------------------------------------------------
mainBox.id = "mainBox";
mainBox.style.display = "none";
mainBox.style.flexDirection = "row";
mainBox.style.alignItems = "center";
mainBox.style.position = "fixed";
mainBox.style.bottom = isMobile() ? "80px" : "20px";
mainBox.style.right = "20px";
mainBox.style.padding = "10px";
mainBox.style.borderRadius = "10px";
mainBox.style.zIndex = 99999;
mainBox.style.gap = "10px";
mainBox.style.overflow = "visible";

// ------------------------------------------------------------------
// Text bubble
// ------------------------------------------------------------------
chatBoxTextdiv.id = "chatBoxTextdiv";
chatBoxTextdiv.style.display = "none";
chatBoxTextdiv.style.marginLeft = "10px";
chatBoxTextdiv.style.marginTop = "0px";
chatBoxTextdiv.style.marginBottom = "0px";
chatBoxTextdiv.style.fontSize = "14px";
chatBoxTextdiv.style.fontWeight = "bold";
chatBoxTextdiv.style.color = "#333";
chatBoxTextdiv.style.minWidth = "50px";
chatBoxTextdiv.style.background = "#FFF";
chatBoxTextdiv.style.padding = "10px";
chatBoxTextdiv.style.borderRadius = "20px";
chatBoxTextdiv.style.position = "relative";
chatBoxTextdiv.style.maxHeight = "130px";
chatBoxTextdiv.style.overflow = "visible";
chatBoxTextdiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
chatBoxTextdiv.style.textWrap = "auto";

// ------------------------------------------------------------------
// Launcher button
// ------------------------------------------------------------------
chatBox.id = "chatBox";
chatBox.style.display = "none";
chatBox.style.background = "#fff";
chatBox.style.bottom = "60px";
chatBox.style.width = "60px";
chatBox.style.height = "60px";
chatBox.style.right = "20px";
chatBox.style.justifyContent = "center";
chatBox.style.alignItems = "center";
chatBox.style.borderRadius = "9999px";
chatBox.style.border = "none";
chatBox.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
chatBox.style.zIndex = 99999;
chatBox.style.cursor = "pointer";

// ------------------------------------------------------------------
// Close icon on text bubble (hover X)
// ------------------------------------------------------------------
chatBoxTextClose.id = "chatBoxId";
chatBoxTextClose.style.position = "absolute";
chatBoxTextClose.style.right = "-10px";
chatBoxTextClose.style.width = "20px";
chatBoxTextClose.style.height = "20px";
chatBoxTextClose.style.backgroundColor = "#d1d1d1";
chatBoxTextClose.style.borderRadius = "50%";
chatBoxTextClose.style.cursor = "pointer";
chatBoxTextClose.style.display = "none";
chatBoxTextClose.style.alignItems = "center";
chatBoxTextClose.style.justifyContent = "center";
chatBoxTextClose.style.zIndex = "10";

const crossLine1 = document.createElement("div");
crossLine1.style.position = "absolute";
crossLine1.style.width = "12px";
crossLine1.style.height = "2px";
crossLine1.style.backgroundColor = "#4a4a49";
crossLine1.style.transform = "rotate(45deg)";

const crossLine2 = document.createElement("div");
crossLine2.style.position = "absolute";
crossLine2.style.width = "12px";
crossLine2.style.height = "2px";
crossLine2.style.backgroundColor = "#4a4a49";
crossLine2.style.transform = "rotate(-45deg)";

chatBoxTextdiv.addEventListener("mouseenter", () => {
    chatBoxTextClose.style.display = "flex";
});

chatBoxTextdiv.addEventListener("mouseleave", () => {
    chatBoxTextClose.style.display = "none";
});

chatBoxTextClose.appendChild(crossLine1);
chatBoxTextClose.appendChild(crossLine2);

chatBoxTextClose.onclick = () => {
    chatBoxTextdiv.style.display = "none";
};

// ------------------------------------------------------------------
// Avatar image
// ------------------------------------------------------------------
chatBoxImage.id = "chatBoxImage";
chatBoxImage.style.borderRadius = "9999px";
chatBoxImage.width = 50;
chatBoxImage.height = 50;
chatBoxImage.style.objectPosition = "contain";

chatBoxCloseIcon.style.borderRadius = "9999px";

// ------------------------------------------------------------------
// Iframe and project id
// ------------------------------------------------------------------
const iframe = document.getElementById("myIframe");
if (!iframe) {
    console.error("Iframe with id 'myIframe' not found");
}

const SourceData = iframe ? iframe.src : "";
const id = SourceData ? SourceData.split("/sdk/")[1].split("?")[0] : null;
let settingsDataVariable;

// ------------------------------------------------------------------
// Font loader
// ------------------------------------------------------------------
function loadGoogleFont(fontName) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
        / /g,
        "+",
    )}&display=swap`;
    document.head.appendChild(link);

    mainBox.style.fontFamily = `${fontName}, sans-serif`;
}

// ------------------------------------------------------------------
// Iframe responsive size
// ------------------------------------------------------------------
const updateIframeSize = () => {
    if (!iframe) return;

    if (isMobile()) {
        iframe.style.bottom = "145px";
    } else {
        iframe.style.width = "500px";
        iframe.style.height = "85%";
        iframe.style.right = "20px";
        iframe.style.top = "auto";
        iframe.style.left = "auto";
        iframe.style.bottom = "85px";
    }
};

const enableFullScreen = () => {
    if (!iframe) return;
    iframe.style.position = "fixed";
    iframe.style.width = "100%";
    iframe.style.height = getMobileHeight();
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.borderRadius = "0px";
    iframe.style.zIndex = "2147483647";

    // Lock background scroll
    // document.body.style.overflow = "hidden";
    // Lock background scroll
    // document.body.style.overflow = "hidden";
    // Apply safe area insets for mobile
    applySafeAreaInsets();
};

const resetFullScreen = () => {
    if (!iframe) return;
    iframe.style.width = "500px";
    iframe.style.height = "85%";
    iframe.style.right = "20px";
    iframe.style.top = "auto";
    iframe.style.left = "auto";
    iframe.style.bottom = "85px";
    iframe.style.position = "fixed";

    //Restore background scroll ---
    // document.body.style.overflow = "";

    // Remove safe area insets
    removeSafeAreaInsets();
};

updateIframeSize();


// ------------------------------------------------------------------
// Handle Mobile/Desktop Transition specifically
// ------------------------------------------------------------------
const handleResponsiveSwitch = () => {
    if (!iframe) return;

    const isOpen = iframe.style.display !== "none";

    if (isMobile()) {
        iframe.style.width = ""; 
        iframe.style.height = ""; 
        iframe.style.right = "";
        iframe.style.top = "";
        iframe.style.left = "";
        if (isOpen) {
            enableFullScreen(); 
        } else {
            iframe.style.bottom = "145px";
        }

    } else {
        if (isOpen) {
            resetFullScreen(); 
        } else {
            updateIframeSize();
        }
    }
    
    updateTextDivWidth();
    mainBox.style.bottom = isMobile() ? "80px" : "20px";
};
// ------------------------------------------------------------------
// RESIZE LISTENER (Critical for mobile keyboard/search bar)
// ------------------------------------------------------------------
window.addEventListener("resize", () => {
    handleResponsiveSwitch();
});

// ------------------------------------------------------------------
// Fetch project + settings
// ------------------------------------------------------------------
if (id) {
    fetch(`${BACKEND_BASE_URL}/project/${id}`)
        .then((r) => r.json())
        .then((r) => {
            const projectData = r?.data ?? r;
            const clientId = projectData?.clientId;
            return fetch(`${BACKEND_BASE_URL}/settings/${clientId}`);
        })
        .then((r) => r.json())
        .then((r) => {
            const data = r?.data ?? r;
            console.log("settings", data);

            chatBoxImage.src = data.s3Response.Location;
            chatBoxImage.onload = function () {
                mainBox.style.display = "flex";
                chatBoxImage.style.width = "50px";
                chatBoxImage.style.height = "50px";
            };

            chatBoxTextContent.textContent = data?.labelText || data?.greet;
            chatBoxTextContent.style.margin = "0px";
            settingsDataVariable = data;
            loadGoogleFont(data?.selectedFont || "Poppins");
        })
        .catch((err) => {
            console.error("Error:", err);
        });
}

// ------------------------------------------------------------------
// Attach DOM nodes
// ------------------------------------------------------------------
mainBox.append(chatBoxTextdiv);
mainBox.append(chatBox);
chatBoxTextdiv.appendChild(chatBoxTextContent);
chatBoxTextdiv.appendChild(chatBoxTextClose);
chatBox.appendChild(chatBoxImage);
document.body.appendChild(mainBox);

updateTextDivWidth();

// ------------------------------------------------------------------
// Bounce animation
// ------------------------------------------------------------------
let position = 0,
    direction = 1,
    bounceHeight = 20,
    speed = 0.3,
    isBouncing = true; // flag to control bounce

function bounceChatBox() {
    if (!isBouncing) return;

    position += direction * speed;
    mainBox.style.transform = `translateY(${position}px)`;
    if (position >= bounceHeight) direction = -1;
    if (position <= 0) direction = 1;
}

setInterval(bounceChatBox, 10);

if (iframe) iframe.style.display = "none";

// ------------------------------------------------------------------
// Powered by bubble
// ------------------------------------------------------------------
const poweredByDiv = document.createElement("div");
poweredByDiv.id = "poweredByDiv";
poweredByDiv.style.display = "none";
poweredByDiv.style.marginLeft = "10px";
poweredByDiv.style.fontSize = "14px";
poweredByDiv.style.fontWeight = "bold";
poweredByDiv.style.color = "#333";
poweredByDiv.style.minWidth = "50px";
poweredByDiv.style.background = "#FFF";
poweredByDiv.style.padding = "10px";
poweredByDiv.style.borderRadius = "20px";
poweredByDiv.style.position = "relative";
poweredByDiv.style.maxHeight = "130px";
poweredByDiv.style.overflow = "visible";
poweredByDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";

mainBox.append(poweredByDiv);

// ------------------------------------------------------------------
// Helper: close widget (same as clicking floating cross)
// ------------------------------------------------------------------
function closeWidgetFromParent() {
    if (!iframe) return;

    // -------------------------------------------------------------

    if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(
            { type: "STOP_VOICE", timestamp: Date.now() },
            "*",
        );
    }

    chatBox.style.transition = "transform 0.5s ease";
    chatBox.style.transform = "rotate(0deg)";
    chatBoxImage.style.transition = "opacity 0.3s ease";
    chatBoxImage.style.opacity = "0";

    setTimeout(() => {
        iframe.style.display = "none";

        // when closed, reset to top of bounce and re-enable bouncing
        position = 0;
        mainBox.style.transform = "translateY(0)";
        poweredByDiv.style.display = "none";

        // Always show launcher again
        chatBox.style.display = "flex";

        if (!isMobile()) {
            chatBoxTextdiv.style.display = "flex";
            chatBoxTextdiv.style.alignItems = "center";
            chatBoxTextdiv.style.justifyContent = "space-between";
        } else {
            chatBoxTextdiv.style.display = "none";
        }

        bounceHeight = 20;
        speed = 0.3;

        if (settingsDataVariable?.s3Response?.Location) {
            chatBoxImage.src = settingsDataVariable.s3Response.Location;
        }
        chatBox.style.transition = "none";
        chatBox.style.transform = "rotate(0deg)";

        chatBoxImage.onload = function () {
            chatBoxImage.style.width = "50px";
            chatBoxImage.style.height = "50px";
            chatBoxImage.style.transition = "opacity 0.5s ease";
            chatBoxImage.style.opacity = "1";
            chatBox.style.transition = "transform 0.5s ease";
            chatBox.style.transform = "rotate(0deg)";
        };

        // restart bounce
        isBouncing = true;
    }, 400);
}

// ------------------------------------------------------------------
// PostMessage handlers from iframe
// ------------------------------------------------------------------
window.addEventListener("message", (event) => {
    console.log("SDK event:", event.data?.type);
    if (!iframe) return;

    if (event.data?.type === "VOICE_CLICKED") {
        if (isMobile()) {
            if (isVoice) {
                chatBox.style.display = "none";
            }
            enableFullScreen();
        } else {
            iframe.style.height = "90%";
            iframe.style.width = "400px";
        }
        iframe.style.background = "transparent";
        iframe.allowTransparency = "true";
        if (!isMobile()) updateIframeSize();
    }

    if (event.data?.type === "CHAT_CLICKED") {
        if (isMobile()) {
            if (isVoice) {
                chatBox.style.display = "none";
            }
            enableFullScreen();
        } else {
            iframe.style.height = "90%";
            iframe.style.width = "400px";
        }
        iframe.style.background = "transparent";
        iframe.allowTransparency = "true";
        if (!isMobile()) updateIframeSize();
    }
    // CHAT_CLICKED_WITHOUT_VOICE

    if (event.data?.type === "CHAT_CLICKED_WITHOUT_VOICE") {
        if (isMobile()) {
            enableFullScreen();
        } else {
            iframe.style.height = "90%";
            iframe.style.width = "400px";
        }
        iframe.style.background = "transparent";
        iframe.allowTransparency = "true";
        if (!isMobile()) updateIframeSize();
    }

    if (event.data?.type === "IS_VOICE") {
        iframe.style.height = "100px";
        iframe.style.width = "120px";
        iframe.style.background = "transparent";
        iframe.allowTransparency = "true";
        isVoice = true;
    }

    if (event.data?.type === "RESET_IFRAME_VOICE") {
        iframe.style.height = "100px";
        iframe.style.width = "120px";
        iframe.style.background = "transparent";
        iframe.allowTransparency = "true";
    }

    if (event.data?.type === "RESET_IFRAME_CHAT") {
    }

    if (event.data?.type === "CLOSE_WIDGET") {
        closeWidgetFromParent();
        iframe.style.height = "100px";
        iframe.style.width = "120px";
        iframe.style.background = "transparent";
        iframe.allowTransparency = "true";

        if (isMobile()) {
            if (isVoice) {
                resetFullScreen();
            } else {
                enableFullScreen();
            }
        } else {
            updateIframeSize();
        }
    }

    if (event.data?.type === "HIDE_AI_AGENT") {
        iframe.style.display = "none";
        mainBox.style.display = "none";
        chatBoxTextdiv.style.display = "none";
        chatBoxTextContent.style.display = "none";
        chatBox.style.display = "none";
        chatBoxImage.style.display = "none";
        chatBoxCloseIcon.style.display = "none";
        chatBoxTextClose.style.display = "none";
        poweredByDiv.style.display = "none";
    }

    if (event.data?.type === "SHOW_AI_AGENT") {
        iframe.style.display = "none";
        mainBox.style.display = "flex";

        if (!isMobile()) {
            chatBoxTextdiv.style.display = "flex";
        } else {
            chatBoxTextdiv.style.display = "none";
        }

        chatBoxTextContent.style.display = "block";
        chatBox.style.display = "flex";
        chatBoxImage.style.display = "block";
        chatBoxCloseIcon.style.display = "flex";
        chatBoxTextClose.style.display = "none";

        updateTextDivWidth();
    }
});

// ------------------------------------------------------------------
// Launcher click: open/close iframe
// ------------------------------------------------------------------
chatBox.onclick = () => {
    if (!iframe) return;

    if (iframe.style.display === "none") {
        isBouncing = false;
        position = bounceHeight;
        mainBox.style.transform = `translateY(${bounceHeight}px)`;

        iframe.contentWindow.postMessage({
            type: 'SHOW_CHAT_WITHOUT_VOICE',
            timestamp: Date.now()
        }, '*');

        iframe.style.display = "block";
        if (isMobile()) {
            if (!isVoice) {
                chatBox.style.display = "none";
                enableFullScreen();
            } else {
                iframe.style.position = "fixed";
                iframe.style.setProperty("bottom", "140px", "important");
                iframe.style.top = "auto";
                iframe.style.left = "auto";
                iframe.style.right = "20px";
            }
        } else {
            iframe.style.borderRadius = "20px";
        }
        mainBox.style.transition = "all 0.3s ease";

        chatBoxTextdiv.style.display = "none";

        chatBoxImage.onload = function () {
            chatBoxImage.style.width = "20px";
            chatBoxImage.style.height = "20px";
        };

        chatBoxImage.style.transition = "opacity 0.5s ease";
        chatBoxImage.style.opacity = "0";
        setTimeout(() => {
            chatBoxImage.src =
                "https://exei-bkt-important-object.s3.ap-south-1.amazonaws.com/cross-19.svg";
            chatBoxImage.style.transition = "opacity 0.5s ease";
            chatBoxImage.style.opacity = "1";
            chatBox.style.transition = "transform 0.5s ease";
            chatBox.style.transform = "rotate(180deg)";
        }, 500);
    } else {
        closeWidgetFromParent();
    }
};