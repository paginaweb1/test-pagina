const posts = [
  {
    title: "Para quien no ha vuelto",
    keywords: "volver alejado iglesia casa roca",
    verse: "Lucas 15:7",
    image: "post-01"
  },
  {
    title: "Para el que cambió de dirección",
    keywords: "direccion orden vida tiempo",
    verse: "Isaías 30:21",
    image: "post-02"
  },
  {
    title: "Para el nuevo",
    keywords: "nuevo invitacion verdad familia",
    verse: "Juan 14:6",
    image: "post-03"
  },
  {
    title: "Para un momento difícil",
    keywords: "dificil cansancio lucha soledad tormenta",
    verse: "Isaías 41:10",
    image: "post-04"
  },
  {
    title: "Para el que está desanimado",
    keywords: "desanimado esperanza obra comenzar nuevo",
    verse: "Isaías 40:31",
    image: "post-05"
  },
  {
    title: "Para el que está avergonzado y con culpa",
    keywords: "perdon culpa avergonzado carga",
    verse: "Isaías 1:18",
    image: "post-06"
  },
  {
    title: "Para el que cree que no necesita a Dios",
    keywords: "Dios orden economia familia vacio alma",
    verse: "Juan 15:5",
    image: "post-07"
  },
  {
    title: "Para el que tiene problemas familiares",
    keywords: "familia casa discusiones problemas puerta abierta",
    verse: "Romanos 12:18",
    image: "post-08"
  },
  {
    title: "Para el que lucha con malos hábitos",
    keywords: "habitos libertad lucha Dios ayuda",
    verse: "1 Corintios 10:13",
    image: "post-09"
  },
  {
    title: "Para quien es cabeza de familia",
    keywords: "cabeza familia hijos decision hogar bendicion",
    verse: "Deuteronomio 6:6-9",
    image: "post-10"
  }
];

const grid = document.querySelector("#posts");
const search = document.querySelector("#search");
const emptyState = document.querySelector("#emptyState");
const viewer = document.querySelector("#viewer");
const viewerImage = document.querySelector("#viewerImage");
const viewerTitle = document.querySelector("#viewerTitle");
const viewerText = document.querySelector("#viewerText");
const viewerShare = document.querySelector("#viewerShare");
const viewerDownload = document.querySelector("#viewerDownload");
const closeViewer = document.querySelector("#closeViewer");
let activePost = null;

function imagePath(post, width = 720) {
  return `assets/img/posts/${post.image}-${width}.webp`;
}

function imageSrcset(post) {
  return [480, 720, 1080].map((size) => `${imagePath(post, size)} ${size}w`).join(", ");
}

function cardTemplate(post, index) {
  const priority = index < 2 ? "eager" : "lazy";
  const fetchPriority = index === 0 ? "high" : "auto";

  return `
    <article class="card" data-title="${post.title.toLowerCase()}" data-keywords="${post.keywords.toLowerCase()}" style="--delay:${index * 45}ms">
      <div class="card-media">
        <img
          src="${imagePath(post, 720)}"
          srcset="${imageSrcset(post)}"
          sizes="(max-width: 640px) 92vw, (max-width: 1100px) 31vw, 245px"
          width="720"
          height="1280"
          loading="${priority}"
          fetchpriority="${fetchPriority}"
          decoding="async"
          alt="Invitación: ${post.title}">
      </div>
      <div class="card-overlay">
        <span class="badge">Mensaje ${index + 1} · ${post.verse}</span>
        <h3 class="card-title">${post.title}</h3>
        <div class="card-actions">
          <button type="button" data-action="share" data-index="${index}">Compartir</button>
          <button type="button" data-action="preview" data-index="${index}">Ver</button>
        </div>
      </div>
    </article>
  `;
}

function renderCards() {
  grid.innerHTML = posts.map(cardTemplate).join("");
  observeCards();
}

function observeCards() {
  const cards = [...document.querySelectorAll(".card")];

  if (!("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = entry.target.style.getPropertyValue("--delay");
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  cards.forEach((card) => observer.observe(card));
}

function filterCards(value) {
  const query = value.trim().toLowerCase();
  const cards = [...document.querySelectorAll(".card")];
  let visibleCount = 0;

  cards.forEach((card) => {
    const haystack = `${card.dataset.title} ${card.dataset.keywords}`;
    const shouldShow = !query || haystack.includes(query);
    card.hidden = !shouldShow;
    if (shouldShow) visibleCount += 1;
  });

  emptyState.hidden = visibleCount > 0;
}

function shareImagePath(post) {
  return `assets/img/share/${post.image}.jpg`;
}

async function getShareFile(post) {
  const response = await fetch(shareImagePath(post));
  const blob = await response.blob();
  return new File([blob], `${post.image}.jpg`, { type: "image/jpeg" });
}

async function sharePost(post) {
  const text = `Te comparto esta invitación de Casa Sobre la Roca: ${post.title}.`;

  try {
    const file = await getShareFile(post);

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: "La Silla Vacía",
        text,
        files: [file]
      });
      return;
    }

    if (navigator.share) {
      await navigator.share({
        title: "La Silla Vacía",
        text,
        url: window.location.href
      });
      return;
    }
  } catch (error) {
    console.warn("No fue posible compartir directamente.", error);
  }

  downloadPost(post);
}

function downloadPost(post) {
  const link = document.createElement("a");
  link.href = shareImagePath(post);
  link.download = `${post.image}.jpg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function openViewer(post) {
  activePost = post;
  viewerTitle.textContent = post.title;
  viewerText.textContent = `Versículo de referencia: ${post.verse}`;
  viewerImage.src = imagePath(post, 1080);
  viewerImage.alt = `Vista previa de la invitación: ${post.title}`;
  viewerDownload.href = shareImagePath(post);
  viewerDownload.download = `${post.image}.jpg`;

  if (typeof viewer.showModal === "function") {
    viewer.showModal();
  } else {
    viewer.setAttribute("open", "");
  }
}

function closeModal() {
  if (typeof viewer.close === "function") {
    viewer.close();
  } else {
    viewer.removeAttribute("open");
  }
}

grid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const post = posts[Number(button.dataset.index)];
  if (button.dataset.action === "share") sharePost(post);
  if (button.dataset.action === "preview") openViewer(post);
});

search.addEventListener("input", (event) => filterCards(event.target.value));
closeViewer.addEventListener("click", closeModal);
viewerShare.addEventListener("click", () => activePost && sharePost(activePost));

viewer.addEventListener("click", (event) => {
  const dialogBounds = viewer.getBoundingClientRect();
  const clickedBackdrop =
    event.clientX < dialogBounds.left ||
    event.clientX > dialogBounds.right ||
    event.clientY < dialogBounds.top ||
    event.clientY > dialogBounds.bottom;

  if (clickedBackdrop) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && viewer.open) closeModal();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((error) => {
      console.warn("Service Worker no registrado.", error);
    });
  });
}

renderCards();
