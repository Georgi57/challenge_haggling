'use strict'; /*jslint node:true*/

module.exports = class Agent {
	
    constructor(me, counts, values, max_rounds, log){
		this.opponent_started = me;
        this.counts = counts;
        this.values = values;
        this.rounds = max_rounds;
        this.log = log;
        this.total = 0;
        for (let i = 0; i<counts.length; i++)
            this.total += counts[i]*values[i];
		
		this.acceptance_value = this.total/2 + 2;
		this.minimal_acceptance_value = this.total/2 - 1;
		this.last_chance_acceptance_value = this.total/2 - 4;
		
		this.best_current_offer = []
		this.best_current_sum = 0;
		
		// Sort the items by value, only once
		this.my_values_ascending = [];
		// Fill it with item numbers
		for (let i = 0; i < this.values.length; i++)
			if (this.values[i]!=0)
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
			if (this.values[i]!=0)
				this.opponents_values_descending.push(i);
		
		this.perfect_offer = [];
		this.my_offers = [];
		this.opponents_offers = [];
		
		this.log(`Counts: ${this.counts}`);
		this.log(`My values: ${this.values}`);
    }
	
    offer(o){
        this.log(`${this.rounds} rounds left`);
        this.rounds--;
		
		
        if (o)
        {
			// ----------------------------------------------
			// Count the amount you'll get if opponents offer accepted
            let sum = this.gain(o);
			// ----------------------------------------------
			
			
			
			// ----------------------------------------------
			// Decision whether to accept (at least half + 1)
			// If the sum is at least half plus one - accept
            if (sum>=this.acceptance_value)
                return;
			
			// In the last round can content with half minus one
			if (this.rounds == 0 && sum>=this.last_chance_acceptance_value && this.opponent_started)
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
			// ----------------------------------------------
        }
		
		
		
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
		{
			o = this.counts.slice(); // Select everything at first
			// Get rid of useless items
			for (let i = 0; i<o.length; i++)
			{
				if (this.values[i] == 0)
				{
					o[i] = 0;
				}
			}
			this.perfect_offer = o;
		}
		else
			o = this.perfect_offer; // Take a perfect offer
		// ----------------------------------------------
		
		
		
		// ----------------------------------------------
		if (this.rounds > 0)
		{
			// Iterate my offer
			for (let iterations = 0; iterations<10; iterations++)
			{
				this.best_current_sum = 0;
				this.search_offer_tree(o.slice());
				
				// Check the value
				if ((this.gain(this.best_current_offer)>=this.acceptance_value)
					&& !(this.offered_before(this.best_current_offer)))
				{
					o = this.best_current_offer;
					break;
				}
				else
				{
					o = this.perfect_offer;
					if (this.acceptance_value > this.minimal_acceptance_value)
						this.acceptance_value-=1;
				}
			}
		}
		
		if (this.rounds == 0 || (this.rounds == 1 && this.opponent_started))
		{
			// Find the best of the opponents offers
			let sum = 0;
			for (let i = 0; i<this.opponents_offers.length; i++)
			{
				this.log(`opponents offers: ${this.opponents_offers[i]}`);
				if (this.opponents_offers[i][1] >= sum && this.opponents_offers[i][1] >= this.last_chance_acceptance_value)
					o = this.opponents_offers[i][0];
					sum = this.opponents_offers[i][1];
			}
		}
			
			
			
		this.log(`Offer: ${o} ${this.gain(o)}`);
		this.my_offers.push([o.slice(),this.gain(o)])
        return o;
    }
	
	// Calculate gain of the offer
	gain(offer)
	{
		let sum = 0;
		for (let i = 0; i<offer.length; i++)
			sum += this.values[i]*offer[i];
		return sum;
	}
	
	// Find best offer using a tree
	search_offer_tree(offer)
	{
		if (offer.every(this.isZero))
			return;
		
		for (let i = 0; i<offer.length; i++)
		{
			if (offer[i]==0)
				continue
			let sum = this.gain(offer)
			if ((sum > this.best_current_sum) && !(this.offered_before(offer)))
			{
				this.best_current_offer = offer.slice();
				this.best_current_sum = sum;
			}
			if (offer[i]!=0)
			{
				let new_offer = offer.slice()
				new_offer[i]-=1
				this.search_offer_tree(new_offer);
			}
		}
	}
	
	// Check if this offer was made before
	offered_before(o)
	{
		for (let i = 0; i<this.my_offers.length; i++)
		{
			let same = true
			for (let j = 0; j<this.my_offers[i][0].length; j++)
			{
				if (this.my_offers[i][0][j] != o[j])
				{
					same = false;
					break;
				}
			}
			if (same)
				return true;
		}
		return false;
	}
	
	isZero(variable) {
		return variable == 0;
	}
};
