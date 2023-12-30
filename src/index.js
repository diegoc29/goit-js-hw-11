import Notiflix from "notiflix";

const apiKey = '41188201-214d0d91838319eb1191e729e';
    let currentPage = 1;

    const searchForm = document.getElementById('search-form');
    const gallery = document.querySelector('.gallery');
    const loadMoreBtn = document.querySelector('.load-more');

    searchForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      const searchQuery = event.target.searchQuery.value.trim();

      // Limpiar galería antes de realizar una nueva búsqueda
      

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
      const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(searchQuery)}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.totalHits === 0) {
          Notiflix.Notify.Info("Sorry, there are no images matching your search query. Please try again.");
        } else {
          data.hits.forEach(image => {
            const card = createImageCard(image);
            gallery.appendChild(card);
          });

          // Mostrar u ocultar el botón "Load more" según si hay más resultados
          loadMoreBtn.style.display = (data.totalHits > currentPage * 40) ? 'block' : 'none';
        }
      } catch (error) {
        console.error('Error during the search:', error);
        Notiflix.Notify.Failure('An error occurred during the search. Please try again.');
      }
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