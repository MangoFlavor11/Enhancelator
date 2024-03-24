/*
This is a fan made Emulator for "Milky way Idle" games Enhancing mechanic by (MangoFlavor).
Obviously i do not own the game nor any art assets in the this projects
*/

var worker = "",
bundle = {
	item_level: 0,
	start_at: 0,
	stop_at: 10,
	use_proto: false,
	proto_at: 0,
	proto_price: 0,
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
sel_item_is_open = false,
enhancer_item_is_open = false,
materials = [],
selected_teas = [],
temp = 0;

function addLeadingZeros(num, length) {
  var str = num.toString()
  while (str.length < length) {
    str = '0' + str
  }
  return str
}

//tims as seconds, return string "00h:00m:00s"
function formatTime(seconds) {
  // Calculate the number of years, days, hours, minutes, and seconds
  var years = Math.floor(seconds / (365 * 24 * 3600))
  var days = Math.floor((seconds % (365 * 24 * 3600)) / (24 * 3600))
  var hours = Math.floor((seconds % (24 * 3600)) / 3600)
  var minutes = Math.floor((seconds % 3600) / 60)
  var remainingSeconds = Math.floor(seconds % 60)

  // Check if the time is greater than 365 days
  if (years > 0) {
    // Check if the number of years is less than 99
    if (years < 99) {
      return (
        addLeadingZeros(years, 2) + 'y:' +
        addLeadingZeros(days, 2) + 'd:' +
        addLeadingZeros(hours, 2) + 'h'
      );
    } else {
      return (
        '000y:' +
        addLeadingZeros(days, 2) + 'd:' +
        addLeadingZeros(hours, 2) + 'h'
      )
    }
  }

  // Check if the time is greater than 24 hours
  if (days > 0) {
    return (
      addLeadingZeros(days, 2) + 'd:' +
      addLeadingZeros(hours, 2) + 'h:' +
      addLeadingZeros(minutes, 2) + 'm'
    )
  }

  // Format the time as a string '00h:00m:00s'
  return (
    addLeadingZeros(hours, 2) + 'h:' +
    addLeadingZeros(minutes, 2) + 'm:' +
    addLeadingZeros(remainingSeconds, 2) + 's'
  )
}

//called after changing anything, because you can't have avg with different sets
function update_values() {
	if(bundle.enhance_skill+bundle.enhance_tea >= bundle.item_level)
		bundle.total_bonus = 1+(0.05*(bundle.enhance_skill+bundle.enhance_tea+bundle.laboratory_level-bundle.item_level)+bundle.enhancer_bonus)/100
	else
		bundle.total_bonus = (1-(0.5*(1-(bundle.enhance_skill+bundle.enhance_tea)/bundle.item_level)))+((0.05*bundle.laboratory_level)+bundle.enhancer_bonus)/100
	for(i = 0; i < success_rate.length; i++) {
		es = Number(success_rate[i]*bundle.total_bonus+0.0005).toFixed(2)
		$(".success_rate_list").find("li:eq("+i+")").text("+"+(i+1)+": +"+es+"%")
	}
	$("#i_time").val((12/(1+(bundle.enhance_skill>bundle.item_level?(bundle.enhance_skill+bundle.enhance_tea+bundle.laboratory_level-bundle.item_level)/100:bundle.laboratory_level/100))).toFixed(2))
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
			bundle.enhance_tea = 0
		}
	}
	//================================================

	if(!selected_teas.includes(selected)) {
		$("#selected_teas").append('<div id="'+selected+'_tea" class="selected_tea"><div id="'+selected+'/remove" class="selected_tea_x btn"><p>X</p></div><svg><use xlink:href="#'+selected+'"></use></svg></div>')
		selected_teas.push(selected)
	}
	switch(selected) {
	case "enhancing_tea":
		bundle.enhance_tea = 3
		break
	case "super_enhancing_tea":
		bundle.enhance_tea = 6
		break
	case "blessed_tea":
		bundle.use_blessing = true
		break
	case "wisdom_tea":
		bundle.wisdom = 1.12
		break
	}
}

function remove_tea(id) {
	$("#"+id+"_tea").remove()
	selected_teas.splice(selected_teas.indexOf(id), 1)
	switch(id) {
	case "enhancing_tea":
		bundle.enhance_tea = 0
		break
	case "super_enhancing_tea":
		bundle.enhance_tea = 0
		break
	case "blessed_tea":
		bundle.use_blessing = false
		break
	case "wisdom_tea":
		bundle.wisdom = 1
		break
	}
}

function validate_field(id, key, value, min, max) {
	if (value === "") {
		$("#"+id).val("")
		bundle[key] = 0
		update_values()
		return
	}

  temp = value.replace(/[^\d.]/g, '').replace(/^(\d*\.\d*)\..*/, '$1').replace(/^(0)(\d)/, '$2')
  if(Number(temp) < min) {
		$("#"+id).val(min.toLocaleString())
		return
	} 
  else if(Number(temp) > max) {
		$("#"+id).val(max.toLocaleString())
		return
	}
    	
	if(temp.includes(".")) {
		temp = temp.split('.')
		temp = Number(temp[0]).toLocaleString()+"."+temp[1]
	}
	else
		temp = Number(temp).toLocaleString()

	$("#"+id).val(temp)
	bundle[key] = Number(temp.replace(/,/g, ''))
	update_values()
}

function reset() {
	$("#use_proto").prop("checked", false)
	$("#proto_price_cell").css("display", "none")
	$("#proto_at_cell").css("display", "none")
	$("#i_proto_price").val("0")
	$("#i_proto_at").val("2")
	
	$("#item_stats").css("display", "none")
	$(".item_slot_icon > svg > use").attr("xlink:href", "#")
	$("#item_slot_text").css("display", "block")

	$("#i_item_level").val("0")
	for(i = 1; i <=5; i++) {
		$("#mat_"+i+"_cell").css("display", "none")
		$("#i_mat_"+i).val("0")
		$("#prc_"+i).val("0")
	}
	$("#iterations").text("0")
	$("#i_coins").val("0")
	materials = []
	close_sel_menus()
	update_values()
}

function close_sel_menus() {
	$("#item_filter").val("")
	sel_item_is_open = false
	$("#sel_item_container").css("display", "none")
	$("#ehnace_level").val("0")
	enhancer_item_is_open = false
	$("#enhancer_item_container").css("display", "none")
}

//chaning any value will change avg, so it must be reseted
function reset_results() {
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
	$("#result_title").text("Total")
	$("#iterations").text("0")
	$("#time").text("0")
	$("#tries").text("0")
	$("#exp").text("0")
	$("#coins").text("0")
	$("#cost").text("0")
	$("#l_cost").text("0")
	$("#h_cost").text("0")

	$("#start_1 > p").text("Start 1 time")
	$("#start_10 > p").text("Start 10 times")
	$("#start_100 > p").text("Start 100 times")
}

function update_result() {
	for(key in avg_result) {
		if(key == "time")
			$("#"+key).text(formatTime(avg_result[key]))
		else
			$("#"+key).text(avg_result[key].toLocaleString())
	}
	$("#iterations").text(all_result.em)

	$("#used_proto_cell").css("display", "none")
	for(i = 1; i <=5; i++) {
		$("#r_mat_"+i+"_cell").css("display", "none")
	}

	if(bundle.use_proto)
		$("#used_proto_cell").css("display", "flex")
	for(i = 0; i < materials.length; i++) {
		$("#r_mat_"+(i+1)+"_cell").css("display", "flex")
		$("#r_mat_"+(i+1)+"_cell_icon > svg > use").attr("xlink:href", "#"+materials[i])
	}

	$("#enhance_area").scrollTop($("#enhance_area").outerHeight(true))
}

function get_values() {
	for(key in bundle) {
		if(key !== "total_bonus" && key !== "em")
			if(key == "use_proto")
				bundle[key] = $("#"+key).prop('checked')
			else if(key == "proto_at") {
				if(Number($("#i_"+key).val().replace(/,/g, '') <= 1))
					$("#i_"+key).val("2")
				bundle[key] = Number($("#i_"+key).val().replace(/,/g, ''))
			}
			else if(key == "stop_at") {
				if(Number($("#i_"+key).val().replace(/,/g, '') <= 1))
					$("#i_"+key).val("1")
				bundle[key] = Number($("#i_"+key).val().replace(/,/g, ''))
			}
			else if(key != "wisdom" && key != "use_blessing" && key != "enhance_tea")
				bundle[key] = Number($("#i_"+key).val().replace(/,/g, ''))
	}
}

function change_item(id) {
	reset()
	$(".item_slot_icon > svg > use").attr("xlink:href", "#"+id)
	sel_item_is_open = false
	$("#sel_item_container").css("display", "none")
	$("#item_slot_text").css("display", "none")

	$("#proto_price_cell").css("display", "none")
	$("#proto_at_cell").css("display", "none")
	$("#i_proto_price").val("0")
	$("#i_proto_at").val("2")

	$("#item_stats").css("display", "flex")
	materials = []
	for(i = 0; i < items_data[id].enhancementCosts.length; i++) {
		elm = items_data[id].enhancementCosts[i]
		if(elm[0] == "coin") {
			$("#i_coins").val(elm[1])
			bundle.coins = elm[1]
		}
		else {
			materials.push(elm[0])
			$("#mat_"+(i+1)+"_cell").css("display", "flex")
			$("#mat_"+(i+1)+"_icon > svg > use").attr("xlink:href", "#"+elm[0])
			$("#i_mat_"+(i+1)).val(elm[1])
			bundle["mat_"+(i+1)] = elm[1]
		}
	}
	$("#i_item_level").val(items_data[id].itemLevel)
	bundle.item_level = items_data[id].itemLevel
	for(key in items_data) {
	  $("#"+key+"_list").css("display", "flex")
	}
	update_values()
}

function filter() {
	temp = $("#item_filter").val().toLowerCase()
	if(temp != "")
		for(key in items_data) {
			if(key.includes(temp))
	    	$("#"+key+"_list").css("display", "flex")
	    else
	    	$("#"+key+"_list").css("display", "none")
		}
	else
		for(key in items_data) {
	    $("#"+key+"_list").css("display", "flex")
		}
}

function change_enhancer(id) {
	temp = Number($("#ehnace_level").val())
	switch(temp) {
	case 0:
		temp = items_data[id].baseBonus * 1
		break
	case 1:
		temp = items_data[id].baseBonus * 1.02
		break
	case 2:
		temp = items_data[id].baseBonus * 1.042
		break
	case 3:
		temp = items_data[id].baseBonus * 1.066
		break
	case 4:
		temp = items_data[id].baseBonus * 1.092
		break
	case 5:
		temp = items_data[id].baseBonus * 1.12
		break
	case 6:
		temp = items_data[id].baseBonus * 1.15
		break
	case 7:
		temp = items_data[id].baseBonus * 1.182
		break
	case 8:
		temp = items_data[id].baseBonus * 1.216
		break
	case 9:
		temp = items_data[id].baseBonus * 1.252
		break
	case 10:
		temp = items_data[id].baseBonus * 1.29
		break
	case 11:
		temp = items_data[id].baseBonus * 1.33
		break
	case 12:
		temp = items_data[id].baseBonus * 1.372
		break
	case 13:
		temp = items_data[id].baseBonus * 1.416
		break
	case 14:
		temp = items_data[id].baseBonus * 1.462
		break
	case 15:
		temp = items_data[id].baseBonus * 1.51
		break
	case 16:
		temp = items_data[id].baseBonus * 1.56
		break
	case 17:
		temp = items_data[id].baseBonus * 1.612
		break
	case 18:
		temp = items_data[id].baseBonus * 1.666
		break
	case 19:
		temp = items_data[id].baseBonus * 1.722
		break
	case 20:
		temp = items_data[id].baseBonus * 1.78
		break
	}
	$("#i_enhancer_bonus").val((temp).toFixed(2))
	bundle.enhancer_bonus = temp
	close_sel_menus()
}

$(document).ready(function() {
	reset()
	get_values()
	update_values()

	//generte items list
	for(key in items_data) {
    $("#sel_item").append('<div id="'+key+'_list" value="'+key+'" class="sel_item_div"><svg><use xlink:href="#'+key+'"></svg></use></div>')
	}

	//generte ehancers items list
	temp = Object.keys(items_data)
	for(i = 296; i < temp.length; i++) {
		$("#enhancer_item").append('<div id="'+temp[i]+'_enhance" value="'+temp[i]+'" class="sel_item_div"><svg><use xlink:href="#'+temp[i]+'"></svg></use></div>')
	}

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
		if(!sel_item_is_open) {
			sel_item_is_open = true
			$("#sel_item_container").css("display", "flex")
		}
		else {
			sel_item_is_open = false
			$("#sel_item_container").css("display", "none")
		}
	})

  $("#info_btn").on("click", function() {
    $("#menu_bg").css("display", "flex")
		$("#info_menu").css("display", "flex")
  })

  $("#item_filter").on("input", function() {
  	filter()
  })

  $("#sel_item").on("click", ".sel_item_div", function() {
  	change_item($(this).attr("value"))
  	update_values()
  })

	$("#i_item_level").on("input", function(){
		validate_field($(this)[0].id, "item_level" , $(this).val(), 0, 200)
	})

	$("#i_start_at").on("input", function() {
		validate_field($(this)[0].id, "start_at" , $(this).val(), 0, 19)
   })

  $("#i_stop_at").on("input", function() {
  	validate_field($(this)[0].id, "stop_at" , $(this).val(), 0, 20)
  })

  $("#use_proto").on("input", function() {
		bundle.use_proto = $("#use_proto").prop('checked')
		if(bundle.use_proto) {
			$("#proto_price_cell").css("display", "flex")
			$("#proto_at_cell").css("display", "flex")
		}
		else {
			$("#proto_price_cell").css("display", "none")
			$("#proto_at_cell").css("display", "none")
		}
		reset_results()
  })

  $("#i_proto_at").on("input", function() {
  	validate_field($(this)[0].id, "proto_at" , $(this).val(), 0, 19)
  })

  $(".mat_sel").on("input", function() {
  	validate_field($(this)[0].id, $(this)[0].id.replace("i_",""), $(this).val(), 0, 1000)
  })

  $(".pric_sel").on("input", function() {
  	validate_field($(this)[0].id, $(this)[0].id.replace("i_",""), $(this).val(), 0, 10000000)
  })

  $("#i_enhance_skill").on("input", function() {
  	validate_field($(this)[0].id, "enhance_skill" , $(this).val(), 0, 200)
	})

	$("#i_enhancer_bonus").on("input", function() {
		validate_field($(this)[0].id, "enhancer_bonus" , $(this).val(), 0, 100)
  })

  $("#i_enhancer_bonus").on("click", function() {
		if(!enhancer_item_is_open) {
			enhancer_item_is_open = true
			$("#enhancer_item_container").css("display", "flex")
		}
		else {
			enhancer_item_is_open = false
			$("#enhancer_item_container").css("display", "none")
		}
	})

	$("#enhancer_item").on("click", ".sel_item_div", function() {
  	change_enhancer($(this).attr("value"))
  	update_values()
  })

	$("#i_laboratory_level").on("input", function() {
		validate_field($(this)[0].id, "laboratory_level" , $(this).val(), 0, 8)
  })

  $("#i_time").on("input", function(){
		validate_field($(this)[0].id, "time" , $(this).val(), 1, 12)
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
			bundle.em = 1
		else if(id == "start_10")
			bundle.em = 10
		else
			bundle.em = 100

		$("#cal").text("Calculating 0%")
		$("#t_tries").text("Tries 0")
		$("#calculating").css("display", "flex")

		worker = new Worker('enhance_worker.js')
		all_result.em += bundle.em
		close_sel_menus()
		worker.postMessage({"bundle": bundle, "avg": avg_result, "all": all_result})

		worker.onmessage = function(e) {
			if(e.data.type == 0) {
				if(bundle.em == 1)
					$("#t_tries").text("Tries "+(e.data.data).toLocaleString())
				else if(bundle.em == 10)
					$("#t_tries").text("Tries "+(e.data.data/10).toLocaleString())
				else
					$("#t_tries").text("Tries "+(e.data.data/100).toLocaleString())				
			}
			else if(e.data.type == 1) {
				if(bundle.em == 1)
					$("#cal").text("Calculating "+e.data.data*100+"%")
				else if(bundle.em == 10)
					$("#cal").text("Calculating "+e.data.data*10+"%")
				else
					$("#cal").text("Calculating "+e.data.data+"%")
			}
			else {
				$("#calculating").css("display", "none")
				if(bundle.em == 1) {
					$("#result_title").text("Total")
				}
				else {
					$("#result_title").text("AVG Total")
				}

				$("#start_1 > p").text("Add 1 time")
				$("#start_10 > p").text("Add 10 times")
				$("#start_100 > p").text("Add 100 times")
				all_result = e.data.all
				avg_result = e.data.avg
	    	update_result()
	    	$(".button").on("click", (e)=> {on_click_btn(e.currentTarget.id)})
	    	$(".button").css("opacity", 1)
	  		worker.terminate()	
			}
		}

		worker.onerror = function(error) {
			$(".button").on("click", ()=> {on_click_btn(e.currentTarget.id)})
			$(".button").css("opacity", 1)
			worker.terminate()
		}
	}
}