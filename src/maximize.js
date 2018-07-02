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
		this.my_values_ascending = []
		// Fill it with item numbers
		for (let i = 0; i < this.values.length; i++)
			this.my_values_ascending.push(i);
		// Sort my values
		this.my_values_ascending.sort(function(a,b)
		{
			return values[a] - values[b];
			
		});
		
		
		// Create opponent value list
		this.opponents_values_descending = []
		// Fill it with item numbers
		for (let i = 0; i < this.values.length; i++)
			this.opponents_values_descending.push(this.values.length);
		
		//TODO remove on submitting
		this.log(`Counts: ${this.counts}`);
		this.log(`My values: ${this.values}`);
		this.log(this.my_values_ascending);
		
		this.last_offer = counts.slice(); // copy of the counts
    }
	
    offer(o){
        this.log(`${this.rounds} rounds left`);
        this.rounds--;
		
		
        if (o)
        {
			// Count the amount you'll get
            let sum = 0;
            for (let i = 0; i<o.length; i++)
                sum += this.values[i]*o[i];
			
			
			
			// Decision whether to accept (at least half + 1)
			// If the sum is at least half plus one - accept
            if (sum>=this.total/2 + 1)
                return;
			
			// In the last round can content with half minus one
			if (this.rounds == 0 && sum>=this.total/2 - 1)
				return;
			
			
			
			// If this is an offer - analyze the opponents offer
			// First understand, which items opponent is keen of discarding.
			this.log(`Opponent values: ${this.opponents_values_descending}`);
			for (let i = 0; i<o.length; i++)
			{
				if (o[i] > 0)
					this.opponents_values_descending[i]--;
				else
					this.opponents_values_descending[i]++;
			}
			this.log(`Opponent values: ${this.opponents_values_descending}`);
        }
		
		// If do no accept - counter offer
        o = this.last_offer; // Take the last offer
		
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
        return o;
    }
};
