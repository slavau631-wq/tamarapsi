const contactConfig = {
  name: "Tamara",
  whatsappNumber: "380639358147",
  avatarUrl: "./avatar.jpg",
  outgoingMessage: "Здравствуйте! Хочу записаться на расклад Таро.",
  buttonLabel: "Перейти в WhatsApp"
};

const AUTO_REDIRECT_DELAY_MS = 1000;
const REDIRECT_AFTER_LEAD_MS = 250;

const profileName = document.getElementById("profileName");
const ctaButton = document.getElementById("ctaButton");
const avatarImage = document.getElementById("profileAvatar");
const avatarFallback = document.getElementById("avatarFallback");
let hasRedirected = false;

function getInitials(name) {
  const cleanName = name.trim();

  if (!cleanName) {
    return "WA";
  }

  return cleanName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function buildWhatsAppLink(number, message) {
  const cleanNumber = number.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

function trackLead() {
  if (typeof window.fbq === "function") {
    window.fbq("track", "Lead");
  }
}

function redirectToWhatsApp(targetUrl) {
  if (!targetUrl || hasRedirected) {
    return;
  }

  hasRedirected = true;
  trackLead();

  window.setTimeout(() => {
    window.location.href = targetUrl;
  }, REDIRECT_AFTER_LEAD_MS);
}

function handleCtaClick(event) {
  event.preventDefault();
  redirectToWhatsApp(ctaButton.href);
}

function renderProfile(config) {
  profileName.textContent = config.name;
  ctaButton.textContent = config.buttonLabel;
  ctaButton.href = buildWhatsAppLink(config.whatsappNumber, config.outgoingMessage);
  avatarFallback.textContent = getInitials(config.name);
  ctaButton.addEventListener("click", handleCtaClick);

  window.setTimeout(() => {
    redirectToWhatsApp(ctaButton.href);
  }, AUTO_REDIRECT_DELAY_MS);

  if (config.avatarUrl.trim()) {
    avatarImage.src = config.avatarUrl;
    avatarImage.onload = () => {
      avatarImage.hidden = false;
      avatarFallback.hidden = true;
    };
    avatarImage.onerror = () => {
      avatarImage.hidden = true;
      avatarFallback.hidden = false;
    };
  }
}

renderProfile(contactConfig);
