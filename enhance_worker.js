let success_rate = [
  50, //+1
  45, //+2
  45, //+3
  40, //+4
  40, //+5
  40, //+6
  35, //+7
  35, //+8
  35, //+9
  35, //+10
  30, //+11
  30, //+12
  30, //+13
  30, //+14
  30, //+15
  30, //+16
  30, //+17
  30, //+18
  30, //+19
  30 //+20
  ];

function cal_exp(il, el) {
  //return 14 + 1.4*il*(1+el)
  return 1.4*(1+el)*(10+il)
}

function find_lowest_Highest(arr) {
  if (arr.length === 0) {
      return { lowest: null, highest: null }
  }

  let lowest = arr[0]
  let highest = arr[arr.length - 1]

  for (let i = 1; i < arr.length; i++) {
      if (arr[i] < lowest) {
          lowest = arr[i]
      }
      if (arr[i] > highest) {
          highest = arr[i]
      }
  }

  return { lowest, highest }
}

self.onmessage = function(e) {
  bundle = e.data.bundle
  total_tries = 0
  curr_tries = 0
  total_used_proto = 0
  curr_used_proto = 0
  enhance_level = 0
  curr_em = 0
  curr_cost = 0
  r = 0

  //this is just for the sake off tries to be updated faster or slower depedning of stop_at
  if(bundle.stop_at >= 18)
    s_tries = 1276777
  else if(bundle.stop_at >= 15)
    s_tries = 976777
  else if(bundle.stop_at >= 13)
    s_tries = 16397
  else
    s_tries = 1639

  //results
  all_result = e.data.all
  avg_result = e.data.avg

  //start 1 or 10 or 100
  while(curr_em < bundle.em) {
    curr_em++
    enhance_level = bundle.start_at
    curr_tries = 0
    curr_used_proto = 0

    //loop till reaching desired item level
    while(enhance_level <bundle.stop_at) {
      total_tries++
      curr_tries++
      r = Math.random() * (100 - 0) + 0
      if(r <= Number((success_rate[enhance_level]*bundle.total_bonus+0.0005).toFixed(2))) {
        if(bundle.use_blessing) {
          r = Math.random() * (100 - 0) + 0
          if(r <= 1) {
            all_result.exp += (cal_exp(bundle.item_level, enhance_level)+cal_exp(bundle.item_level, enhance_level+1))*bundle.wisdom
            enhance_level += 2
          }
          else {
            all_result.exp += cal_exp(bundle.item_level, enhance_level)*bundle.wisdom
            enhance_level++
          }
        }
        else {
          all_result.exp += cal_exp(bundle.item_level, enhance_level)*bundle.wisdom
          enhance_level++
        }
      }
      else if(bundle.use_proto && enhance_level >= bundle.proto_at) {
        total_used_proto++
        curr_used_proto++
        all_result.exp += cal_exp(bundle.item_level, enhance_level)*bundle.wisdom*0.1
        enhance_level--
      }
      else {
        all_result.exp += cal_exp(bundle.item_level, enhance_level)*bundle.wisdom*0.1
        enhance_level = 0
      }

      if(total_tries % s_tries == 0)
        self.postMessage({"type": 0, "data": total_tries.toString()})
    }

    all_result.tries += curr_tries
    all_result.used_proto += curr_used_proto
    all_result.mat_1 += curr_tries * bundle.mat_1
    all_result.mat_2 += curr_tries * bundle.mat_2
    all_result.mat_3 += curr_tries * bundle.mat_3
    all_result.mat_4 += curr_tries * bundle.mat_4
    all_result.mat_5 += curr_tries * bundle.mat_5
    all_result.prc_1 += curr_tries * bundle.mat_1 * bundle.prc_1
    all_result.prc_2 += curr_tries * bundle.mat_2 * bundle.prc_2
    all_result.prc_3 += curr_tries * bundle.mat_3 * bundle.prc_3
    all_result.prc_4 += curr_tries * bundle.mat_4 * bundle.prc_4
    all_result.prc_5 += curr_tries * bundle.mat_5 * bundle.prc_5
    all_result.coins += curr_tries * bundle.coins
    all_result.time += curr_tries * bundle.time
    all_result.proto_prc += curr_used_proto * bundle.proto_price
    all_result.cost = all_result.prc_1 + all_result.prc_2 + all_result.prc_3 + all_result.prc_4 + all_result.prc_5 + all_result.coins + all_result.proto_prc

    curr_cost = (curr_tries * bundle.mat_1 * bundle.prc_1) + (curr_tries * bundle.mat_2 * bundle.prc_2) +
      (curr_tries * bundle.mat_3 * bundle.prc_3) + (curr_tries * bundle.mat_4 * bundle.prc_4) + 
      (curr_tries * bundle.mat_5 * bundle.prc_5) + (curr_tries * bundle.coins) + (curr_used_proto * bundle.proto_price)

    if(all_result.l_cost == 0) {
      all_result.l_cost = curr_cost
      all_result.total_l_cost += curr_cost
      all_result.l_cost_div++
    }
    else if(curr_cost < all_result.l_cost) {
      all_result.l_cost = curr_cost
      all_result.total_l_cost += curr_cost
      all_result.l_cost_div++
    }

    if(curr_cost > all_result.h_cost) {
      all_result.h_cost = curr_cost
      all_result.total_h_cost += curr_cost
      all_result.h_cost_div++
    }

    self.postMessage({"type": 1, "data": curr_em})
  }

  //get average by dividing by all_result.em
  for(key in avg_result) {
    avg_result[key] = all_result[key] / all_result.em
  }

  avg_result.l_cost = all_result.total_l_cost / all_result.l_cost_div
  avg_result.h_cost = all_result.total_h_cost / all_result.h_cost_div

  self.postMessage({"type": 2, "avg": avg_result, "all": all_result})
}