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
		
		this.acceptance_value = this.total/2 + 4;
		this.minimal_acceptance_value = this.total/2;
		this.last_chance_acceptance_value = this.total/2 - 3;
		
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
			if (this.rounds == 0 && (sum>=this.last_chance_acceptance_value - 1) && this.opponent_started)
				return;
			//-----------------------------------------------
			
			
			
			// ----------------------------------------------
			// If this is an offer - analyze the opponents offer
			// First understand, which items opponent is keen of discarding.
			for (let i = 0; i<o.length; i++)
			{
				if (o[i] > 0)
					this.opponents_values_prediction[i] += o[i];
			}
			this.log(`Opponents least valued items: ${this.opponents_values_prediction}`);
			// ----------------------------------------------
			
			
			
			// ----------------------------------------------
			// Save the opponents offer for future reference
			this.opponents_offers.push([o,sum])
			// ----------------------------------------------
        }
		
		
		
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
			
			// If the perfect offer is the same as the count, add it to the offerred list to skip it.
			// No real point of offering it.
			let same = 1;
			for (let i = 0; i<this.perfect_offer.length; i++)
			{
				if (this.perfect_offer[i] != this.counts[i])
				{
					same = 0;
					break;
				}
			}
			if (same == 1)
				this.my_offers.push([this.perfect_offer.slice(),this.gain(this.perfect_offer),this.opponent_gain(this.perfect_offer)])
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
					if (this.acceptance_value > this.minimal_acceptance_value + ((this.rounds)/2))
						this.acceptance_value-=1;
				}
			}
		}
		
		if (this.rounds == 0)
		{
			// Find the best of the opponents offers
			let sum = 0;
			for (let i = 0; i<this.opponents_offers.length; i++)
			{
				this.log(`opponents offers: ${this.opponents_offers[i]}`);
				if (this.opponents_offers[i][1] >= sum && this.opponents_offers[i][1] >= this.last_chance_acceptance_value)
				{
					o = this.opponents_offers[i][0];
					sum = this.opponents_offers[i][1];
				}
			}
			
			if (this.offered_before(o))
			{
				o = this.my_offers[this.my_offers.length-1][0];
			}
		}
			
			
			
		this.log(`Offer: ${o} ${this.gain(o)} ${this.opponent_gain(o)}`);
		this.my_offers.push([o.slice(),this.gain(o),this.opponent_gain(o)])
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
		// Check that this is not a zero count
		if (offer.every(this.isZero))
			return;
		
		
		// Calculate gain
		let sum = this.gain(offer);
		let opponent_sum = this.opponent_gain(offer);

	
		// Now check whether this offer is suitable
		if ((sum + opponent_sum > this.best_current_sum) && !(this.offered_before(offer)))
		{
			this.best_current_offer = offer.slice();
			this.best_current_sum = sum + opponent_sum;
		}
		
		// Check offers with even less items as well
		for (let i = 0; i<offer.length; i++)
		{
			if (offer[i]==0)
				continue
			else
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
	
	opponent_gain(offer) {
		let sum = 0;
		for (let i = 0; i<offer.length; i++)
			sum += this.opponents_values_prediction[i]*offer[i]*0.6;
		return sum;
	}
};
