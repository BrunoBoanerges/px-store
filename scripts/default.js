const TWITCH_URL = "https://www.twitch.tv/player_dbr";
const CATEGORIES = {
  GAMES: 0,
  ART: 1,
  GAMEDEV: 2,
  STICKERS: 3,
};

function buyStuff(itemId) {
  navigator.clipboard.writeText(`!reservar ${itemId}`).then(() => {
    const win = window.open(TWITCH_URL, "_blank");
    win.focus();
  });
}

function copyId(itemId) {
  navigator.clipboard.writeText(`ID: ${itemId}`).then(() => {
    $(`.shop-item .item-copy-msg[data-id='${itemId}']`).removeClass('hidden')
    setTimeout(() => {
      $('.shop-item .item-copy-msg').addClass('hidden')
    }, 3000);
  });
}

function numberWithCommas(x) {
  if (!x) return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(function () {
  $("#navigation nav .menu").on("click", () => {
    $("#navigation nav .nav-itens").toggleClass("hidden visible");
  });

  $.getJSON("./assets/itens.json", (data) => {
    const itens = data || [];
    const renderItens = itens.map((item) => {
      const htmlFragment = `
        <article class="shop-item shadow" data-aos="fade-in">
          <div class="item-img">
            <img src="${item.image_url}" />
          </div>
          <h3>${item.name.toLowerCase()}</h3>
          <b 
            class="item-discount 
            ${item.original_price ? "" : "invisible"}"
          >
            ${numberWithCommas(item.original_price)}
          </b>
          <b>${numberWithCommas(item.price)}</b>
          <div class="shop-buy-btn" onclick='buyStuff(${item.id})'>
            <img src="./assets/ic_cart.svg" />
            <h4>Comprar</h4>
          </div>
          <div class="item-copy-msg hidden" data-id="${item.id}">
            <p>ID copiado!</p>
          </div>
          <div class="item-id" onclick='copyId(${item.id})'>
            <p>ID: ${item.id}</p>
          </div>
          <a class="item-preview ${item.preview_url ? "" : "hidden"}" 
            rel="no-referer" 
            target="_blank" 
            href="${item.preview_url}"
          >
            <p>Prévia</p>
            <img src="./assets/ic_eye.svg" />
          </a>
        </article>
      `;

      return {
        cat: item.category,
        htmlFragment,
      };
    });

    function createSingleHtml(render = []) {
      console.log(render);
      let temp = "";

      if (render.length === 0) {
        return `<h3 class="text-empty">Oops.. os itens dessa categoria já acabaram :(</h3>`;
      }

      for (const item of render) {
        temp += item.htmlFragment;
      }
      return temp;
    }

    const renderStuff = [
      {
        cat: CATEGORIES.GAMES,
        itens: createSingleHtml(renderItens.filter((r) => r.cat === CATEGORIES.GAMES)),
      },
      {
        cat: CATEGORIES.ART,
        itens: createSingleHtml(renderItens.filter((r) => r.cat === CATEGORIES.ART)),
      },
      {
        cat: CATEGORIES.GAMEDEV,
        itens: createSingleHtml(renderItens.filter((r) => r.cat === CATEGORIES.GAMEDEV)),
      },
      {
        cat: CATEGORIES.STICKERS,
        itens: createSingleHtml(renderItens.filter((r) => r.cat === CATEGORIES.STICKERS)),
      },
    ];

    renderStuff.forEach((item) => {
      switch (item.cat) {
        case CATEGORIES.GAMES:
          $("#games .shop-itens-container").append(item.itens);
          break;

        case CATEGORIES.ART:
          $("#art .shop-itens-container").append(item.itens);
          break;
        case CATEGORIES.GAMEDEV:
          $("#gamedev .shop-itens-container").append(item.itens);
          break;
        case CATEGORIES.STICKERS:
          $("#stickers .shop-itens-container").append(item.itens);
          break;
        default:
          break;
      }
    });
  });
});
