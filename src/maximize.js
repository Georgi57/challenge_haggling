'use strict'; /*jslint node:true*/

module.exports = class Agent {
	
    constructor(me, counts, values, max_rounds, log){
        this.counts = counts;
        this.values = values;
        this.rounds = max_rounds;
        this.log = log;
        this.total = 0;
        for (let i = 0; i<counts.length; i++)
            this.total += counts[i]*values[i];
		
		
		// Sort the items by value, only once
		this.my_values_ascending = [];
		// Fill it with item numbers
		for (let i = 0; i < this.values.length; i++)
			this.my_values_ascending.push(i);
		// Sort my values
		this.my_values_ascending.sort(function(a,b)
		{
			return values[a] - values[b];
			
		});
		
		
		// Create opponent value prediction list
		this.opponents_values_prediction = [];
		// Fill it with item numbers
		for (let i = 0; i < this.values.length; i++)
			this.opponents_values_prediction.push(0);
		
		// Create opponent value list (has to be sorted every turn according to predictions list)
		this.opponents_values_descending = [];
		// Fill it with item numbers
		for (let i = 0; i < this.values.length; i++)
			this.opponents_values_descending.push(i);
		
		this.my_offers = [];
		this.opponents_offers = [];
		
		this.log(`Counts: ${this.counts}`);
		this.log(`My values: ${this.values}`);
		this.log(this.my_values_ascending);
    }
	
    offer(o){
        this.log(`${this.rounds} rounds left`);
        this.rounds--;
		
		
        if (o)
        {
			// ----------------------------------------------
			// Count the amount you'll get if opponents offer accepted
            let sum = 0;
            for (let i = 0; i<o.length; i++)
                sum += this.values[i]*o[i];
			// ----------------------------------------------
			
			
			
			// ----------------------------------------------
			// Decision whether to accept (at least half + 1)
			// If the sum is at least half plus one - accept
            if (sum>=this.total/2 + 1)
                return;
			
			// In the last round can content with half minus one
			if (this.rounds == 0 && sum>=this.total/2 - 1)
				return;
			//-----------------------------------------------
			
			
			
			// ----------------------------------------------
			// If this is an offer - analyze the opponents offer
			// First understand, which items opponent is keen of discarding.
			for (let i = 0; i<o.length; i++)
			{
				if (o[i] > 0)
					this.opponents_values_prediction[i]--;
				else
					this.opponents_values_prediction[i]++;
			}
			// ----------------------------------------------
			
			
			
			// ----------------------------------------------
			// Save the opponents offer for future reference
			this.opponents_offers.push([o,sum])
			this.log(this.opponents_offers);
			// ----------------------------------------------
        }
		
		
		this.log(this.my_offers);
		
		
		
		// ----------------------------------------------
		// Now sort the opponent values
		let prediction = this.opponents_values_prediction;
		this.opponents_values_descending.sort(function(a,b)
		{
			return prediction[b] - prediction[a];
			
		});
		// ----------------------------------------------
		
		
		
		// ----------------------------------------------
		// Get my previous offer
		if (this.my_offers.length == 0)
			o = this.counts.slice(); // Select everything at first
		else
			o = this.my_offers[this.my_offers.length-1][0]; // Take last offer
		// ----------------------------------------------
		
		
		
		// ----------------------------------------------
		// Decrease the least valued item by one
        for (let i = 0; i<o.length; i++)
        {
            if (o[this.my_values_ascending[i]] != 0)
			{
                o[this.my_values_ascending[i]]--;
				this.log(`Offer: ${o}`);
				break;
			}
        }
		// ----------------------------------------------
		
		
		
		// ----------------------------------------------
		// Count the current offer value
		let sum = 0;
		for (let i = 0; i<o.length; i++)
			sum += this.values[i]*o[i];
		// ----------------------------------------------
			
			
			
		
		this.my_offers.push([o,sum])
        return o;
    }
};
