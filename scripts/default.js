const TWITCH_URL = "https://www.twitch.tv/player_dbr";
const CATEGORIES = {
  GAMES: 0,
  ART: 1,
  GAMEDEV: 2,
  STICKERS: 3,
};
let ITEMS = [];

function buyStuff(itemId) {
  navigator.clipboard.writeText(`!reservar ${itemId}`).then(() => {
    $("#modal-container").removeClass("hidden");
    $("#modal-buy").removeClass("hidden");
    let txItem = $("#modal-buy b").text();
    const item = ITEMS.find((i) => i.id === itemId);
    txItem = txItem.replace("##id##", `${item.id}`);
    txItem = txItem.replace("##name##", `${item.name.toLowerCase()}`);
    $("#modal-buy b").text(txItem);

    $("#modal-buy a").on("click", () => {
      $("#modal-container").addClass("hidden");
      $("#modal-buy").addClass("hidden");
      $("#modal-buy b").text("##id## - ##name##");
    });
  });
}

function copyId(itemId) {
  navigator.clipboard.writeText(`ID: ${itemId}`).then(() => {
    $(`.shop-item .item-copy-msg[data-id='${itemId}']`).removeClass("hidden");
    setTimeout(() => {
      $(".shop-item .item-copy-msg").addClass("hidden");
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

  $("#navigation nav .nav-itens a").on("click", () => {
    if (window.innerWidth <= 768) {
      $("#navigation nav .nav-itens").toggleClass("hidden visible");
    }
  });

  $("#modal-container .modal-fade").on("click", () => {
    $("#modal-container").addClass("hidden");
    $("#modal-buy").addClass("hidden");
    $("#modal-buy b").text("##id## - ##name##");
  });

  $.getJSON("./scripts/itens.json", (data) => {
    const itens = data || [];
    ITEMS = itens;
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
          <b>
            <img src="./assets/ic_cube.svg" alt="">
            ${numberWithCommas(item.price)}
          </b>
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
            rel="noreferrer" 
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

// let elems = $(".item-box");
// let json = [];
// elems.each((index, element) => {
//   const image_url = $(element).children(".box-header").css("background-image").replace(/url\(/gi, '').replace(/['"();]/gi, '');
//   const id = $(element).children(".box-header").children('.id').text().replace(/ID: /gi, "");
//   const name = $(element).children(".dados").children('.title').text();
//   const price = $(element).children(".dados").children('.px').text().replace(/,/gi, "");
//   const original_price = $(element).children(".dados").children('.pxold').children('s').text().replace(/,/gi, "");
//   const preview_url = $(element).children(".dados").children('a').attr("href");

//   json.push({
//     image_url,
//     id: parseInt(id, 10),
//     name,
//     price: price ? parseInt(price, 10) : null,
//     original_price: original_price ? parseInt(original_price, 10) : null,
//     preview_url,
//     category: 0
//   });
// });

// console.log(JSON.stringify(json));
