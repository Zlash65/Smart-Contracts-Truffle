pragma solidity >=0.4.22 <0.6.0;

contract HalfMoneyCashback {

	uint public received;
	uint public cashback;

    // initiates a contract to receive donation
	function receiveDonation() public payable {
		donateBackHalf(msg.value);
		received = msg.value;
	}
    
	// initiate a return of hald the donation received
	function donateBackHalf(uint amount) private {
		msg.sender.transfer(amount/2);
		cashback = amount/2;
	}
    
}