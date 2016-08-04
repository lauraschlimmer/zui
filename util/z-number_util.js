/**
 * This file is part of the "zui" project
 *   Copyright (c) 2016, zScale Technologies GmbH - All rights reserved.
 *
 * Authors:
 *   Laura Schlimmer <laura@zscale.io>
 *   Paul Asmuth <paul@zscale.io>
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the zScale Technologies GmbH nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ZSCALE TECHNOLOGIES GMBH BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
window.zNumberUtil = (window.zNumberUtil || {});

zNumberUtil.kCurrencySymbols = {
  "EUR": "€"
};

zNumberUtil.formatNumber = function(value) {
  var parts = value.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

zNumberUtil.formatNumberWithFixedDecimals = function(n) {
  return function(value) {
    return zNumberUtil.formatNumber(parseFloat(value).toFixed(n));
  };
}

zNumberUtil.formatPercent = function(value, decimals) {
  if (!decimals) {
    decimals = 0;
  }

  return (parseFloat(value) * 100).toFixed(decimals) + " %";
}

zNumberUtil.formatPercentWithFixedDecimals = function(decimals) {
  return function(value) {
    return zNumberUtil.formatPercent(value, decimals);
  };
}

zNumberUtil.formatMoney = function(currency, cents) {
  var number = zNumberUtil.formatNumber((parseInt(cents) / 100.0).toFixed(2));
  var currency_symbol = currency;
  if (zNumberUtil.kCurrencySymbols.hasOwnProperty(currency)) {
    currency_symbol = zNumberUtil.kCurrencySymbols[currency];
  }

  return number + " " + currency_symbol;
}

zNumberUtil.formatMoneyWithCurrency = function(curreny) {
  return function(cents) {
    return zNumberUtil.formatMoney(curreny, cents);
  };
}

zNumberUtil.formatDuration = function(value) {
  var withLeadingZero = function(number) {
    if (parseInt(number) < 10) {
      return "0" + number.toFixed(0);
    }

    return "" + number.toFixed(0);
  };

  var val = parseInt(value);
  if (value > 3600) {
    return withLeadingZero(val / 3600) + ":" +
           withLeadingZero((val % 3600) / 60) + ":" +
           withLeadingZero(val % 60);
  } else {
    return withLeadingZero(val / 60) + ":" + withLeadingZero(val % 60);
  }
}

zNumberUtil.compareNumbers = function(a, b) {
  return (a ? parseFloat(a) : 0) - (b ? parseFloat(b) : 0);
}

zNumberUtil.printWithLeadingZero = function(number) {
  if (parseInt(number) < 10) {
    return "0" + number;
  }

  return "" + number;
};
