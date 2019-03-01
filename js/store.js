brah.store = brah.store || {
    price: 0,
    items: {},

    storage: {
        cart: {},

        get: function (id) {
            if (id) {
                return brah.store.storage.cart[id];
            }
            return brah.store.storage.cart;
        },

        addItem: function (id, variationId, quantity) {
            if (id && variationId && quantity) {
                brah.store.storage.cart[id] = {
                    variation: variationId,
                    quantity: quantity
                };
                var cartString = brah.storage.get('cart') || '{}',
                    cart;
                if (cartString) {
                    cart = JSON.parse(cartString);
                    if (cart) {
                        cart[id] = {
                            variation: variationId,
                            quantity: quantity
                        };
                        cartString = JSON.stringify(cart);
                        if (cartString) {
                            brah.storage.set('cart', cartString);
                        }
                    }
                }
            }
        },

        removeItem: function (id) {
            if (id) {
                delete brah.store.storage.cart[id];
                var cartString = brah.storage.get('cart') || '{}',
                    cart;
                if (cartString) {
                    cart = JSON.parse(cartString);
                    if (cart && cart[id]) {
                        delete cart[id];
                        cartString = JSON.stringify(cart);
                        if (cartString) {
                            brah.storage.set('cart', cartString);
                        }
                    }
                }
            }
        },

        init: function () {
            var cartString = brah.storage.get('cart') || '{}';
            brah.storage.set('cart', cartString);
            brah.store.storage.cart = JSON.parse(cartString);
        }
    },

    UI: {
        getItem$: function (id, variationId, quantity) {
            if (id) {
                var item = brah.store.items[id],
                    icon = 'fa-times',
                    action1 = brah.store.removeItem,
                    action2 = brah.store.viewCartItem;
                if (item) {
                    if (!variationId) {
                        variationId = Object.keys(item.variations)[0];
                        icon = 'fa-cart-arrow-down';
                        action1 = brah.store.addItem;
                        action2 = brah.store.viewStoreItem;
                    }

                    var $item = $('<div></div>')
                        .addClass('item')
                        .attr('data-id', id)
                        .attr('data-variation', variationId)
                        .attr('data-quantity', quantity || 1)
                        .css({
                            backgroundColor: '#' + item.color,
                            backgroundImage: 'url("' + item.image + '")'
                        })
                        .html($('<div></div>')
                            .html($('<p></p>')
                                .text(item.name))
                            .append($('<i></i>')
                                .addClass('fa ' + icon)
                                .off('click').on('click', action1))
                            .append($('<i></i>')
                                .addClass('fa fa-search-plus')
                                .off('click').on('click', action2))
                            .append($('<input></input>')
                                .attr('id', id + '-' + variationId)
                                .attr('name', id + '-' + variationId)
                                .attr('type', 'number')
                                .val(quantity || 1)));
                    return $item;
                }
            }
        },

        addItem: function (id, variationId, quantity) {
            if (id && variationId && quantity) {
                var $item = $('#cart .item[data-id=' + id + ']'),
                    $partner = $('#store .item[data-id=' + id + ']');
                if (!$item.length) {
                    $item = brah.store.UI.getItem$(id, variationId, quantity);
                    $('#cart .items').append($item);
                }
                if ($item) {
                    $item.attr('data-variation', variationId);
                    $item.attr('data-quantity', quantity);
                    $partner.attr('data-quantity', quantity);
                    var $input = $item.find('input');
                    $input.val(quantity);
                    $input.attr('name', id + '-' + variationId);
                    $input.attr('id', id + '-' + variationId);
                    brah.store.UI.setPrice();
                }
            }
        },

        removeItem: function (id, variationId, quantity) {
            if (id && variationId && quantity) {
                var $item = $('#cart [data-id=' + id + ']');
                $item.remove();
                brah.store.UI.setPrice();
            }
        },

        toggleCart: function (event) {
            $("#cart, #preview").toggleClass('open');
        },

        setPrice: function () {
            brah.store.price = 0;
            $.each(brah.store.storage.cart, function (id, item) {
                brah.store.price += parseInt(brah.store.items[id].variations[item.variation].price) * parseInt(item.quantity);
            });
            $('#preview span:nth-child(3)').html(brah.store.getPrice(brah.store.price));
        },

        populate: function () {
            var $items = $('#store .items');
            $items.html('');
            $.each(brah.store.items, function (id, item) {
                if (item.enabled) {
                    var $item = brah.store.UI.getItem$(id);
                    $items.append($item);
                } else {
                    brah.store.storage.removeItem(id);
                }
            });
            brah.store.init();
        },

        init: function () {
            var cartString = brah.storage.get('cart') || '{}',
                cart;

            if (cartString) {
                cart = JSON.parse(cartString);
                if (cart) {
                    $.each(cart, (k, v) => brah.store.UI.addItem(k, v.variation, v.quantity));
                }
            }
        }
    },

    getPrice: function (cents) {
        if (cents || cents === 0) {
            return '$' + cents / 100 + '.' + cents % 100 + (cents % 100 < 10 ? '0' : '');
        }
    },

    addItem: function (e) {
        var $this = $(this).parent().parent(),
            id = $this.attr('data-id'),
            variationId = $this.attr('data-variation'),
            quantity = 1;
        brah.store.storage.addItem(id, variationId, quantity);
        brah.store.UI.addItem(id, variationId, quantity);
    },

    removeItem: function (e) {
        var $this = $(this).parent().parent(),
            id = $this.attr('data-id'),
            variationId = $this.attr('data-variation'),
            quantity = $this.attr('data-quantity');
        brah.store.storage.removeItem(id);
        brah.store.UI.removeItem(id, variationId, quantity);
    },

    viewItem: function ($this) {
        if ($this) {
            var id = $this.attr('data-id'),
                variationId = $this.attr('data-variation'),
                quantity = $this.attr('data-quantity'),
                item = brah.store.items[id],
                variation = item.variations[variationId];
            $('#Details').attr('data-id', id).attr('data-variation', variationId);
            $('#Details .image').css('backgroundImage', $this.css('backgroundImage'));
            $('#Details .name').text(item.name);
            $('#Details .var-name').text(item.variations[Object.keys(item.variations)[0]].name);
            $('#Details .price').text(brah.store.getPrice(variation.price));
            $('#Details .description').text(item.description);
            $('#Details .stock').text(variation.stock);
            $('#Details input').attr('max', variation.stock);

            var $variations = $('#Details .variations').html('');
            $.each(brah.store.items[id].variations, function (key, variation) {
                $variations.append($('<div></div>')
                    .append($('<input></input>')
                        .attr('type', 'radio')
                        .attr('name', id)
                        .attr('data-price', variation.price)
                        .attr('data-name', variation.name)
                        .attr('data-stock', variation.stock)
                        .attr('data-id', key)
                        .val(key)
                        .off('click').on('click', function () {
                            $('#Details').attr('data-variation', $(this).attr('data-id'));
                            $('#Details .stock').text($(this).attr('data-stock'));
                            $('#Details input').attr('max', $(this).attr('data-stock'));
                            $('#Details .var-name').text($(this).attr('data-name'));
                            $('#Details .price').text(brah.store.getPrice($(this).attr('data-price')));
                        }))
                    .append($('<p></p>').text(variation.name)));
            });
            $('#Details .variations input[data-id="' + variationId + '"]').click();
            $('#Details').modal('show');
        }
    },

    viewStoreItem: function (e) {
        var $this = $(this).parent().parent(),
            $button = $('#Details .input-group button'),
            $quantity = $('#Details .input-group input'),
            id = $this.attr('data-id'),
            $cartItem = $('#cart .item[data-id=' + id + ']');
        if ($cartItem.length) {
            $button.text('Update');
            $quantity.val($cartItem.attr('data-quantity'));
        } else {
            $button.text('Add to Cart');
            $quantity.val(1);
        }
        brah.store.viewItem($this);
    },

    viewCartItem: function (e) {
        var $this = $(this).parent().parent();
        $('#Details .input-group button').text('Update');
        $('#Details .input-group input').val($this.attr('data-quantity'));
        brah.store.viewItem($this);
    },

    updateItems: function (e) {
        var $this = $('#Details'),
            id = $this.attr('data-id'),
            variationId = $this.attr('data-variation'),
            quantity = $this.find('.input-group input').val();
        brah.store.storage.addItem(id, variationId, quantity);
        brah.store.UI.addItem(id, variationId, quantity);
    },

    events: function () {
        $('.fa-cart-arrow-down').off('click').on('click', brah.store.addItem);
        $('#store .fa-search-plus').off('click').on('click', brah.store.viewStoreItem);
        $('#cart .fa-search-plus').off('click').on('click', brah.store.viewCartItem);
        $('#preview').off('click').on('click', brah.store.UI.toggleCart);
        $('#Details .input-group button').off('click').on('click', brah.store.updateItems);
    },

    parse: function (json) {
        var promises = [];
        $.each(json.objects, function (key1, item) {
            var entry = {
                name: item.item_data.name,
                description: item.item_data.description,
                color: item.item_data.label_color,
                category: item.item_data.category_id,
                image: item.item_data.image_url,
                variations: {},
                enabled: false
            };
            item.item_data.variations.map(function (variation) {
                entry.variations[variation.id] = {
                    name: variation.item_variation_data.name,
                    price: variation.item_variation_data.price_money.amount,
                    stock: 0
                };
                promises.push(new Promise(function (resolve, reject) {
                    $.getJSON({
                        url: 'StoreItems/' + variation.id,
                        data: '',
                        success: function (json) {
                            if (json && json.counts && json.counts[0] && json.counts[0].quantity > 0) {
                                brah.store.items[item.id].enabled = true;
                            }
                            if (json.counts) {
                                brah.store.items[item.id].variations[variation.id].stock = json.counts[0].quantity || 0;
                                
                            } else {
                                delete brah.store.items[item.id].variations[variation.id];
                            }
                            resolve(variation.id);
                        }
                    });
                }));
            });
            brah.store.items[item.id] = entry;
        });
        Promise.all(promises).then(brah.store.UI.populate);
    },

    getItems: function () {
        $.getJSON({
            url: 'StoreItems',
            data: '',
            success: brah.store.parse
        }).fail(brah.store.init);
    },

    init: function () {
        brah.store.storage.init();
        brah.store.UI.init();
        brah.store.events();
    }
};

$(brah.store.getItems);