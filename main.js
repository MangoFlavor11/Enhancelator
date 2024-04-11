/*
This is a fan made Emulator for "Milky way Idle" games Enhancing mechanic by (MangoFlavor).
Obviously i do not own the game nor any art assets in the this projects
*/

var worker = "",
version = "v 1.3.2",
enhance_bonus = [
	1, // +0
	1.02, // +1
	1.042, // +2
	1.066, // +3
	1.092, // +4
	1.12, // +5
	1.15, // +6
	1.182, // +7
	1.216, // +8
	1.252, // +9
	1.29, // +10
	1.33, // +11
	1.372, // +12
	1.416, // +13
	1.462, // +14
	1.51, // +15
	1.56, // +16
	1.612, // +17
	1.666, // +18
	1.722, // +19
	1.78 // +20
],
info_ = {
	item_level: 0,
	start_at: 0,
	stop_at: 10,
	use_proto: false,
	proto_at: 0,
	proto_price: 0,
	use_gloves: false,
	gloves_level: 0,
	enhance_skill: 0,
	enhancer_bonus: 0,
	laboratory_level: 0,
	enhance_tea: 0,
	total_bonus: 0,
	wisdom: 1,
	use_blessing: false,
	time: 0,
	mat_1: 0,
	mat_2: 0,
	mat_3: 0,
	mat_4: 0,
	mat_5: 0,
	prc_1: 0,
	prc_2: 0,
	prc_3: 0,
	prc_4: 0,
	prc_5: 0,
	coins: 0,
	em: 1,
},
//all results without dividing
all_result = {
	em: 0,
  time: 0,
  tries: 0,
  exp: 0,
  coins: 0,
  used_proto: 0,
  proto_prc: 0,
  mat_1: 0,
  mat_2: 0,
  mat_3: 0,
  mat_4: 0,
  mat_5: 0,
  prc_1: 0,
  prc_2: 0,
  prc_3: 0,
  prc_4: 0,
  prc_5: 0,
  cost: 0,
  l_cost: 0,
  h_cost: 0,
  total_l_cost: 0,
  total_h_cost: 0,
  l_cost_div: 0,
  h_cost_div: 0
},
//result after dividing for avarage
avg_result = {
	time: 0,
  tries: 0,
  exp: 0,
  coins: 0,
  used_proto: 0,
  proto_prc: 0,
  mat_1: 0,
  mat_2: 0,
  mat_3: 0,
  mat_4: 0,
  mat_5: 0,
  prc_1: 0,
  prc_2: 0,
  prc_3: 0,
  prc_4: 0,
  prc_5: 0,
  cost: 0,
  l_cost: 0,
  h_cost: 0
},
materials = [],
selected_teas = [],
temp = 0;

//tims as seconds, return string "00y:000d:00h:00m:00s"
function formatTime(seconds) {
  // Calculate the number of years, days, hours, minutes, and seconds
  var years = (Math.floor(seconds / 31536000)).toString()
  var days = (Math.floor((seconds % 31536000) / 86400)).toString()
  var hours = (Math.floor((seconds % 86400) / 3600)).toString()
  var minutes = (Math.floor((seconds % 3600) / 60)).toString()
  var remainingSeconds = (Math.floor(seconds % 60)).toString()

  if (years > 0)
    return years.padStart(2, '0')+"y:"+days.padStart(3, '0')+"d:"+hours.padStart(2, '0')+"h:"+minutes.padStart(2, '0')+"m"
  else if (days > 0)
    return days.padStart(3, '0')+"d:"+hours.padStart(2, '0')+"h:"+minutes.padStart(2, '0')+"m:"+remainingSeconds.padStart(2, '0')+"s"
  else
  	return hours.padStart(2, '0')+"h:"+minutes.padStart(2, '0')+"m:"+remainingSeconds.padStart(2, '0')+"s"
}

//called after changing anything, because you can't have avg with different sets
function update_values() {
	if(info_.enhance_skill+info_.enhance_tea >= info_.item_level)
		info_.total_bonus = 1+(0.05*(info_.enhance_skill+info_.enhance_tea+info_.laboratory_level-info_.item_level)+info_.enhancer_bonus)/100
	else
		info_.total_bonus = (1-(0.5*(1-(info_.enhance_skill+info_.enhance_tea)/info_.item_level)))+((0.05*info_.laboratory_level)+info_.enhancer_bonus)/100
	for(i = 0; i < success_rate.length; i++) {

		es = Number(success_rate[i]*info_.total_bonus).toFixed(2)
		$(".success_rate_list").find("li:eq("+i+")").text("+"+(i+1)+": +"+es+"%")
	}
	if(info_.use_gloves)
		temp = get_enhancing_bonus("i_gloves_level", "171")
	else
		temp = 0
	temp = (12/(1+(info_.enhance_skill>info_.item_level?((info_.enhance_skill+info_.enhance_tea+info_.laboratory_level-info_.item_level)+temp)/100:(info_.laboratory_level+temp)/100))).toFixed(2)
	$("#i_time").val(temp)
	info_.time = Number(temp)
	reset_results()
}

function add_tea() {
	selected = $("#tea_sel").val()

	//=====Make sure only one enhance tea present=====
	if(selected == "enhancing_tea" || selected == "super_enhancing_tea") {
		if(!selected_teas.includes(selected)) {
			$("#enhancing_tea_tea").remove()
			$("#super_enhancing_tea_tea").remove()
			selected_teas.splice(selected_teas.indexOf(selected == "enhancing_tea" ? "super_enhancing_tea":"enhancing_tea"), 1)
			info_.enhance_tea = 0
		}
	}
	//================================================

	if(!selected_teas.includes(selected)) {
		$("#selected_teas").append('<div id="'+selected+'_tea" class="selected_tea"><div id="'+selected+'/remove" class="selected_tea_x btn"><p>&#10005;</p></div><svg><use xlink:href="#'+selected+'"></use></svg></div>')
		selected_teas.push(selected)
	}
	switch(selected) {
	case "enhancing_tea":
		info_.enhance_tea = 3
		break
	case "super_enhancing_tea":
		info_.enhance_tea = 6
		break
	case "blessed_tea":
		info_.use_blessing = true
		break
	case "wisdom_tea":
		info_.wisdom = 1.12
		break
	}
}

function remove_tea(id) {
	$("#"+id+"_tea").remove()
	selected_teas.splice(selected_teas.indexOf(id), 1)
	switch(id) {
	case "enhancing_tea":
		info_.enhance_tea = 0
		break
	case "super_enhancing_tea":
		info_.enhance_tea = 0
		break
	case "blessed_tea":
		info_.use_blessing = false
		break
	case "wisdom_tea":
		info_.wisdom = 1
		break
	}
}

function validate_field(id, key, value, min, max) {
	value = Number(value)
	min = Number(min)
	max = Number(max)

	if (value == 0) {
		$("#"+id).val(0)
		info_[key] = 0
		update_values()
		return
	}

  if(value < min) {
		$("#"+id).val()
		info_[key] = min
	} 
  else if(value > max) {
		$("#"+id).val(max)
		info_[key] = max
	}
	else {
		$("#"+id).val(value)
		info_[key] = value
	}
	update_values()
}

function reset() {
	$("#use_proto").prop("checked", false)
	$("#proto_price_cell").css("display", "none")
	$("#proto_at_cell").css("display", "none")
	$("#use_gloves").prop("checked", false)
	$("#gloves_level_cell").css("display", "none")
	$("#i_proto_price").val("0")
	$("#i_proto_at").val("2")
	$("#i_gloves_level").val("0")
	
	$("#item_stats").css("display", "none")
	$(".item_slot_icon > svg > use").attr("xlink:href", "#")
	$("#item_slot_text").css("display", "block")

	$("#i_item_level").val("0")
	for(i = 1; i <=5; i++) {
		$("#i_mat_"+i).val("0")
		$("#i_prc_"+i).val("0")
		$("#mat_"+i+"_cell").css("display", "none")
	}
	$("#iterations").text("0")
	$("#i_coins").val("0")
	materials = []
	close_sel_menus()
	update_values()
}

function stop_calc(stop) {
	if(stop)
		all_result.em -= info_.em
	$("#calculating").css("display", "none")
	$(".button").on("click", (e)=> {on_click_btn(e.currentTarget.id)})
	$(".button").css("opacity", 1)
	worker.terminate()
}

function close_sel_menus() {
	$("#item_filter").val("")
	$("#sel_item_container").css("display", "none")
	$("#ehnace_level").val("0")
	$("#enhancer_item_container").css("display", "none")
}

//chaning any value will change avg, so it must be reseted
function reset_results() {
	$("#reset_result").css("display", "none")

	for(key in all_result) {
		all_result[key] = 0
	}
	for(key in avg_result) {
		avg_result[key] = 0
	}

	$("#used_proto_cell").css("display", "none")
	for(i = 1; i <=5; i++) {
		$("#r_mat_"+i+"_cell").css("display", "none")
	}
	$("#result_title").text("Result")
	$("#iterations").text("0")
	$("#time").text("0")
	$("#tries").text("0")
	$("#exp").text("0")
	$("#coins").text("0")
	$("#cost").text("0")
	$("#l_cost").text("0")
	$("#h_cost").text("0")

	$("#start_1 > p").text("Start 1 itteration")
	$("#start_10 > p").text("Start 10 itteration")
	$("#start_100 > p").text("Start 100 itteration")
}

function update_result() {
	for(key in avg_result) {
		if(key == "time")
			$("#"+key).text(formatTime(avg_result.tries*info_.time))
		else
			$("#"+key).text(avg_result[key].toLocaleString())
	}
	$("#iterations").text(all_result.em)

	$("#used_proto_cell").css("display", "none")
	for(i = 1; i <=5; i++) {
		$("#r_mat_"+i+"_cell").css("display", "none")
	}

	if(info_.use_proto)
		$("#used_proto_cell").css("display", "flex")
	for(i = 0; i < materials.length; i++) {
		$("#r_mat_"+(i+1)+"_cell").css("display", "flex")
		$("#r_mat_"+(i+1)+"_cell_icon > svg > use").attr("xlink:href", "#"+materials[i])
	}

	$("#enhance_area").scrollTop($("#enhance_area").outerHeight(true))
}

function get_values() {
	for(key in info_) {
		if(key !== "total_bonus" && key !== "em")
			if(key == "use_proto")
				info_[key] = $("#"+key).prop('checked')
			else if(key == "use_gloves")
				info_[key] = $("#"+key).prop('checked')
			else if(key == "proto_at") {
				if(Number($("#i_"+key).val().replace(/,/g, '') <= 1))
					$("#i_"+key).val("2")
				info_[key] = Number($("#i_"+key).val().replace(/,/g, ''))
			}
			else if(key == "stop_at") {
				if(Number($("#i_"+key).val().replace(/,/g, '') <= 1))
					$("#i_"+key).val("1")
				info_[key] = Number($("#i_"+key).val().replace(/,/g, ''))
			}
			else if(key != "wisdom" && key != "use_blessing" && key != "enhance_tea")
				info_[key] = Number($("#i_"+key).val().replace(/,/g, ''))
	}
}

function change_item(value, index) {
	reset()
	$(".item_slot_icon > svg > use").attr("xlink:href", "#"+value)
	$("#sel_item_container").css("display", "none")
	$("#item_slot_text").css("display", "none")

	$("#proto_price_cell").css("display", "none")
	$("#proto_at_cell").css("display", "none")
	$("#i_proto_price").val("0")
	$("#i_proto_at").val("2")

	$("#item_stats").css("display", "flex")
	materials = []
	for(i = 0; i < items_data[index].enhancementCosts.length; i++) {
		elm = items_data[index].enhancementCosts[i]
		if(elm[0] == "coin") {
			$("#i_coins").val(elm[1])
			info_.coins = elm[1]
		}
		else {
			materials.push(elm[0])
			$("#mat_"+(i+1)+"_cell").css("display", "flex")
			$("#mat_"+(i+1)+"_icon > svg > use").attr("xlink:href", "#"+elm[0])
			$("#i_mat_"+(i+1)).val(elm[1])
			info_["mat_"+(i+1)] = elm[1]
		}
	}
	$("#i_item_level").val(items_data[index].itemLevel)
	info_.item_level = items_data[index].itemLevel
	items_data.forEach(function(item, index) {
		key = item.key
	  $("#"+key+"_list").css("display", "flex")
	})
	update_values()
}

function filter() {
	temp = $("#item_filter").val().toLowerCase()
	if(temp != "")
		items_data.forEach(function(item, index) {
			key = item.key
			if(key.includes(temp))
	    	$("#"+key+"_list").css("display", "flex")
	    else
	    	$("#"+key+"_list").css("display", "none")
		})
	else
		items_data.forEach(function(item, index) {
			key = item.key
	    $("#"+key+"_list").css("display", "flex")
		})
}

function get_enhancing_bonus(value, index) {
	temp = Number($("#"+value).val())
	temp = items_data[index].baseBonus * enhance_bonus[temp]
	return Number(temp.toFixed(2))
}

$(document).ready(function() {
	window.scrollTo(0, 1)
	$("#version").text(version)
	reset()
	get_values()
	update_values()

	//generte items list
	items_data.forEach(function(item, index) {
		key = item.key
    $("#sel_item").append('<div id="'+key+'_list" value="'+key+'" data="'+index+'" class="sel_item_div"><svg><use xlink:href="#'+key+'"></svg></use></div>')
	})

	//generte ehancers items list
	for(i = 296; i < items_data.length; i++) {
		key = items_data[i].key
		$("#enhancer_item").append('<div id="'+key+'_enhance" value="'+key+'" data="'+i+'" class="sel_item_div"><svg><use xlink:href="#'+key+'"></svg></use></div>')
	}

	//click on transparent background
	$("#menu_bg").on("click", function() {
    $("#menu_bg").css("display", "none")
		$("#info_menu").css("display", "none")
		$("#success_rate_menu").css("display", "none")
  })

	$("#success_rate_btn").on("click", function() {
		$("#menu_bg").css("display", "flex")
		$("#success_rate_menu").css("display", "flex")
  })

	$("#item_slot").on("click", ".item_slot_icon", function() {
		temp = $("#sel_item_container").css("display")
		$("#sel_item_container").css("display", temp == "flex" ? "none":"flex")
	})

  $("#info_btn").on("click", function() {
    $("#menu_bg").css("display", "flex")
		$("#info_menu").css("display", "flex")
  })

  $("#item_filter").on("input", function() {
  	filter()
  })

  $("#sel_item").on("click", ".sel_item_div", function() {
  	change_item($(this).attr("value"), $(this).attr("data"))
  	update_values()
  })

  $("#use_proto").on("input", function() {
		info_.use_proto = $("#use_proto").prop('checked')
		if(info_.use_proto) {
			$("#proto_price_cell").css("display", "flex")
			$("#proto_at_cell").css("display", "flex")
		}
		else {
			$("#proto_price_cell").css("display", "none")
			$("#proto_at_cell").css("display", "none")
		}
		reset_results()
  })

  $("#use_gloves").on("input", function() {
		info_.use_gloves = $("#use_gloves").prop('checked')
		if(info_.use_gloves)
			$("#gloves_level_cell").css("display", "flex")
		else
			$("#gloves_level_cell").css("display", "none")
		reset_results()
		update_values()
  })

  $("input[type='number']").on("input", function() {
  	validate_field($(this)[0].id, $(this)[0].id.replace("i_", ""), $(this)[0].value, $(this)[0].min, $(this)[0].max)
	})

  $("#i_enhancer_bonus").on("click", function() {
  	temp = $("#enhancer_item_container").css("display")
		$("#enhancer_item_container").css("display", temp == "flex" ? "none":"flex")
	})

	$("#enhancer_item").on("click", ".sel_item_div", function() {
  	temp = get_enhancing_bonus("ehnace_level", $(this).attr("data"))
  	$("#i_enhancer_bonus").val((temp).toFixed(2))
		info_.enhancer_bonus = temp
  	close_sel_menus()
  	update_values()
  })

	$("#tea_sel").change(function() {
		add_tea()
		update_values()
  })

  $(".selected_teas").on("click", ".selected_tea_x", function() {
		id = $(this)[0].id.split("/")[0]
		remove_tea(id)
		update_values()
  })

	$(".button").on("click", function() {
		on_click_btn($(this)[0].id)
	})
})

function on_click_btn(id) {
	if(id == "reset")
		reset()
	else if(materials.length > 0) {
		$(".button").off("click")
		$(".button").css("opacity", 0.5)

		if(id == "start_1")
			info_.em = 1
		else if(id == "start_10")
			info_.em = 10
		else
			info_.em = 100

		$("#cal").text("Calculating 0%")
		$("#t_tries").text("Tries 0")
		$("#calculating").css("display", "flex")

		worker = new Worker('enhance_worker.js')
		all_result.em += info_.em
		close_sel_menus()
		worker.postMessage({"Enhancelator": 0, "info_": info_, "avg": avg_result, "all": all_result})

		worker.onmessage = function(e) {
			if(!e.data.hasOwnProperty('Enhancelator'))
    		return
			if(e.data.type == 0) {
				if(info_.em == 1)
					$("#t_tries").text("Attempts "+(e.data.data).toLocaleString())
				else if(info_.em == 10)
					$("#t_tries").text("Attempts "+(e.data.data/10).toLocaleString())
				else
					$("#t_tries").text("Attempts "+(e.data.data/100).toLocaleString())				
			}
			else if(e.data.type == 1) {
				if(info_.em == 1)
					$("#cal").text("Calculating "+e.data.data*100+"%")
				else if(info_.em == 10)
					$("#cal").text("Calculating "+e.data.data*10+"%")
				else
					$("#cal").text("Calculating "+e.data.data+"%")
			}
			else {
				if(info_.em == 1) {
					$("#result_title").text("Result")
				}
				else {
					$("#result_title").text("AVG Result")
				}

				$("#reset_result").css("display", "flex")
				$("#start_1 > p").text("Add 1 itteration")
				$("#start_10 > p").text("Add 10 itteration")
				$("#start_100 > p").text("Add 100 itteration")
				all_result = e.data.all
				avg_result = e.data.avg
	    	update_result()
	    	stop_calc(false)
			}
		}

		worker.onerror = function(error) {
			$(".button").on("click", ()=> {on_click_btn(e.currentTarget.id)})
			$(".button").css("opacity", 1)
			worker.terminate()
		}
	}
}