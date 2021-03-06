'use strict';

var keystone = require('keystone'),
    _ = require('lodash'),
    Types = keystone.Field.Types;

var Page = new keystone.List('Page', {
    map: { name: 'title' },
    autokey: { path: 'slug', from: 'title', unique: true }
});

var PageCategory = new keystone.List('PageCategory', {

});

function updateNavigation() {
    Page.model.find({
        state: 'published'
    }, function(err, pages) {

        // get the primary Navigation
        var navigation = keystone.get('navigation');

        navigation.forEach(function (navLink, i) {
            console.log('naviLink',navLink);
            navLink.children = [];
            
            setSubNavLink(pages, navLink);

        });
    });
}

function setSubNavLink(pages, navLink) {
    
    pages.forEach(function(page, i) {

        if (page.parent == navLink.key) {
            navLink.children.push({
                label: page.title,
                key: page.slug,
                href: '/' + page.parent + '/' + page.slug
            });
        }
    });
}

Page.add({
    title: { type: String, required: true },
    slug: { type: String, index: true },
    state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
    author: { type: Types.Relationship, ref: 'User', index: true },
    publishedDate: { type: Types.Date, index: true },
    parent: {
        type: Types.Select,
        options: _.map(keystone.get('navigation'), 'key').join(','),
        required: true,
        default: keystone.get('navigation')[0].key
    },
    content: {
        html: { type: Types.Html, wysiwyg: true, height: 600 }
    },
    categories: { type: Types.Relationship, ref: 'PageCategory', many: true }
});

Page.defaultColumns = 'title, parent|10%, state|10%, author|10%, publishedDate|20%';

// Update navigation on page save
Page.schema.post('save', function () {

    updateNavigation();
});

Page.register();

PageCategory.register();

// Init navigation
updateNavigation();