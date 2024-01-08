import Notiflix from "notiflix";

const apiKey = '41188201-214d0d91838319eb1191e729e';
    let currentPage = 1;

    const searchForm = document.getElementById('search-form');
    const gallery = document.querySelector('.gallery');
    const loadMoreBtn = document.querySelector('.load-more');

    searchForm.addEventListener('submit', async function(event) {
  event.preventDefault();

  // Acceder al elemento del formulario por su nombre
  const searchQueryInput = event.target.elements.searchQuery;
  const searchQuery = searchQueryInput.value.trim();

  // Limpiar galería antes de realizar una nueva búsqueda
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';

  currentPage = 1;

  if (searchQuery !== '') {
    await performSearch(searchQuery);
    loadMoreBtn.style.display = 'block';
  } else {
    // Manejar el caso en el que no se proporciona una cadena de búsqueda
    Notiflix.Notify.Warning('Please enter a search query.');
  }
});

    loadMoreBtn.addEventListener('click', async function() {
      currentPage++;
      const searchQuery = searchForm.searchQuery.value.trim();
      await performSearch(searchQuery);
    });

    async function performSearch(searchQuery) {
  const gallery = document.querySelector('.gallery'); // Mover la inicialización aquía

  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(searchQuery)}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.totalHits === 0) {
      Notiflix.Notify.Info("Sorry, there are no images matching your search query. Please try again.");
    } else {
      data.hits.forEach(image => {
        const card = createImageCard(image);

        // Verificar si gallery está definido antes de usar appendChild
        if (gallery) {
          gallery.appendChild(card);
        }
      });

       // Desplazar suavemente después de cargar imágenes
       smoothScroll(gallery);

      // Mostrar u ocultar el botón "Load more" según si hay más resultados
      loadMoreBtn.style.display = (data.totalHits > currentPage * 40) ? 'block' : 'none';
    }
  } catch (error) {
    console.error('Error during the search:', error);
    Notiflix.Notify.failure('An error occurred during the search. Please try again.');
  }
}

// Función para desplazamiento suave
function smoothScroll(element) {
  const { height: cardHeight } = element.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}


    function createImageCard(image) {
      const card = document.createElement('div');
      card.className = 'photo-card';

      const imageElement = document.createElement('img');
      imageElement.src = image.webformatURL;
      imageElement.alt = image.tags;
      imageElement.loading = 'lazy';

      const infoDiv = document.createElement('div');
      infoDiv.className = 'info';

      const infoItems = ['Likes', 'Views', 'Comments', 'Downloads'];
      infoItems.forEach(item => {
        const p = document.createElement('p');
        p.className = 'info-item';
        p.innerHTML = `<b>${item}:</b> ${image[item.toLowerCase()]}`;
        infoDiv.appendChild(p);
      });

      card.appendChild(imageElement);
      card.appendChild(infoDiv);

      return card;
    }

  
  // Mostrar la ventana modal al hacer clic en una imagen
document.querySelector('.gallery').addEventListener('click', function(event) {
  if (event.target.tagName === 'IMG') {
    const modalImage = document.getElementById('modalImage');
    const modalLikes = document.getElementById('modalLikes');
    const modalViews = document.getElementById('modalViews');
    const modalComments = document.getElementById('modalComments');
    const modalDownloads = document.getElementById('modalDownloads');

    const selectedImage = event.target;
    modalImage.src = selectedImage.src;
    modalImage.alt = selectedImage.alt;

    // Obtener detalles de la imagen desde los atributos de la imagen
    const likes = selectedImage.nextElementSibling.querySelector('.info-item:nth-child(1)').textContent;
    const views = selectedImage.nextElementSibling.querySelector('.info-item:nth-child(2)').textContent;
    const comments = selectedImage.nextElementSibling.querySelector('.info-item:nth-child(3)').textContent;
    const downloads = selectedImage.nextElementSibling.querySelector('.info-item:nth-child(4)').textContent;

    modalLikes.textContent = likes.split(':')[1].trim();
    modalViews.textContent = views.split(':')[1].trim();
    modalComments.textContent = comments.split(':')[1].trim();
    modalDownloads.textContent = downloads.split(':')[1].trim();

    document.getElementById('myModal').style.display = 'block';
  }
});

// Cerrar la ventana modal al hacer clic en el botón de cerrar
document.getElementById('closeModalBtn').addEventListener('click', function() {
  document.getElementById('myModal').style.display = 'none';
});