/*jslint browser: true*/
/*global $, jQuery, alert*/
//USER SETTINGS
"use strict";
$.noConflict();
jQuery("#usersetmenu").on("click", function (e) {

    if (jQuery(this).hasClass("open")) {
        jQuery(this).removeClass("open");
        jQuery(this).children("ul").slideUp("fast");
    } else {
        jQuery(this).addClass("open");
        jQuery(this).children("ul").slideDown("fast");
    }
    e.stopPropagation();
    jQuery("body").click(function () {
        if (!jQuery(e.target).closest("#usersetmenu").length);
        jQuery("#usersetmenu").children("ul").hide();
    });
});

//FLAGS
jQuery("#flag-icons").on("click", function (e) {
    alert('falg-icons');
    if (jQuery(this).hasClass("open")) {
        jQuery(this).removeClass("open");
        jQuery(this).children("ul").slideUp("fast");
    } else {
        jQuery(this).addClass("open");
        jQuery(this).children("ul").slideDown("fast");
    }
    e.stopPropagation();
    jQuery("body").click(function () {
        if (!jQuery(e.target).closest("#flag-icons").length);
        jQuery("#flag-icons").children("ul").hide();
    });
});
