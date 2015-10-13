function getBaseCostByLevel() {

	var BASE			= 20;
	var POWER			= 1.2;
	var currentLevel 	= parseInt($("#info div.data.level").text());

	// We round to the nearest 10.
	var ROUND_BASE		= 10;
	var baseValue		= Math.round((Math.pow(POWER, currentLevel) * BASE) / ROUND_BASE) * ROUND_BASE;

	return baseValue;
}

//
// statName: e.g. "endurance", "oddness" etc.
//
function setCostByBonusLevel(statName) {

	var costElement	= $("div.button." + statName + " div.cost");

	var baseVal		= costElement.data("base");
	var currentVal	= parseInt($("#info div.data." + statName).text());
	var maximumVal	= parseInt($("#info div.data." + statName + "Max").text());

	var POWER		= 2;
	var levelCost	= Math.pow(POWER, currentVal) * baseVal;

	var baseCost	= getBaseCostByLevel();
	var targetCost	= baseCost + levelCost;
	
	costElement.text(targetCost);

	// Check if needs greying out.
	var remainingGP	= parseInt($("input[type='text']").val());

	var tooPoor		= targetCost > remainingGP;
	var maxLevel	= currentVal >= maximumVal;

	if ( !$.isNumeric(remainingGP) || tooPoor || maxLevel ) {

		if ( maxLevel ) {
			costElement.text("-");
		}

		$(costElement).parent().addClass('disabled');
	}
	else {

		$(costElement).parent().removeClass('disabled');
	}
}

function setAllCosts() {

	setCostByBonusLevel("endurance");
	setCostByBonusLevel("oddness");
	setCostByBonusLevel("strength");
	setCostByBonusLevel("nerve");
	setCostByBonusLevel("precision");
	setCostByBonusLevel("acuity");
	setCostByBonusLevel("reflexes");
}

function resetSingleStat(statName) {

	$("#info div.data." + statName).text(0);
}

function resetCalculator() {

	$("#info div.data.level").text(0);

	resetSingleStat("endurance");
	resetSingleStat("oddness");
	resetSingleStat("strength");
	resetSingleStat("nerve");
	resetSingleStat("precision");
	resetSingleStat("acuity");
	resetSingleStat("reflexes");

	setAllCosts();
}

function bindEvents() {

	$(document).on("keypress", "input[type='text']", function(e) {

		// Reset on pressing enter.
		if ( e.which == 13 ) {
			resetCalculator();
		}

		// Restrict gold input to numbers.
		var key = String.fromCharCode(e.which);
		if ( !$.isNumeric(key) ) {
			
			e.preventDefault();
			return false;
		}
	});

	$(document).on("click", "div.button", function(e) {

		if ( $(this).hasClass("disabled") ) {
			return;
		}

		var cost 	= parseInt($(this).find(".cost").text());
		var goldEl	= $("input[type='text']");

		// Decrease remaining gold.
		goldEl.val(parseInt(goldEl.val()) - cost);

		// Increase dynasty level.
		var levelEl	= $("#info div.data.level");
		levelEl.text(parseInt(levelEl.text()) + 1);

		// Increase stat level.
		var	theStat	= $(this).data("stat");
		var statEl	= $("#info div.data." + theStat);
		statEl.text(parseInt(statEl.text()) + 1);

		setAllCosts();
	});
}

$(document).ready(function() {

	bindEvents();

	setAllCosts();

});