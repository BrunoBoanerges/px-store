const TWITCH_URL = "https://www.twitch.tv/player_dbr";
const CATEGORIES = {
  GAMES: 0,
  ART: 1,
  GAMEDEV: 2,
  STICKERS: 3,
};

$(function () {
  $("#navigation nav .menu").on("click", () => {
    $("#navigation nav .nav-itens").toggleClass("hidden visible");
  });

  $.getJSON("./assets/itens.json", (data) => {
    const itens = data || [];
    const renderItens = itens.map((item) => {
      const htmlFragment = `
        <article class="shop-item shadow">
          <div class="item-img">
            <img src="${item.image_url}" />
          </div>
          <h3>${item.name}</h3>
          <b 
            class="item-discount 
            ${item.original_price ? "" : "invisible"}"
          >
            ${item.original_price}
          </b>
          <b>${item.price}</b>
          <div class="shop-buy-btn" onclick='buyStuff(${item.id})'>
            <img src="./assets/ic_cart.svg" />
            <h4>Comprar</h4>
          </div>
          <div class="item-id">
            <p>ID: ${item.id}</p>
          </div>
          <a class="item-preview" rel="no-referer" target="_blank" href="${item.preview_url}">
            <p>${item.preview_url ? "Prévia" : "Sem Prévia"}</p>
            <img src="./assets/ic_eye.svg" />
          </a>
        </article>
      `;

      return {
        cat: item.category,
        htmlFragment,
      };
    });

    const games = renderItens.filter((r) => r.cat === CATEGORIES.GAMES);
    const art = renderItens.filter((r) => r.cat === CATEGORIES.ART);
    const gamedev = renderItens.filter((r) => r.cat === CATEGORIES.GAMEDEV);
    const stickers = renderItens.filter((r) => r.cat === CATEGORIES.STICKERS);

    for (const game of games) {
      $("#games .shop-itens-container").append(game.htmlFragment);
    }

    for (const a of art) {
      $("#art .shop-itens-container").append(a.htmlFragment);
    }

    for (const gd of gamedev) {
      $("#gamedev .shop-itens-container").append(gd.htmlFragment);
    }

    for (const sticker of stickers) {
      $("#sticker .shop-itens-container").append(sticker.htmlFragment);
    }
  });
});

function buyStuff(itemId) {
  navigator.clipboard.writeText(`!reservar ${itemId}`).then(() => {
    const win = window.open(TWITCH_URL, "_blank");
    win.focus();
  });
}

function copyId(itemId) {
  navigator.clipboard.writeText(`ID: ${itemId}`).then(() => {
    //
  });
}

// !reservar <id>
