var socket = io();
	
	socket.on('number_information', function (info) {
		var numInfo = eval(info);
		var rowsCount = $('#informationLog tr').length;
		var bullsClass = numInfo.bulls > 0 ? 'warning' : '';
		var cowsClass = numInfo.cows > 0 ? 'info' : '';
		$('#informationLog').append(
			'<tr>' + 
				'<td>' + rowsCount + '</td>' +
				'<td>' + numInfo.actualNumber + '</td>' + 
				'<td class="' + bullsClass + '">' + numInfo.bulls + '</td>' + 
				'<td class="' + cowsClass + '">' + numInfo.cows + '</td>' + 
			'</tr>'
		);
		
		$('#txtNumber').val('');

		if(numInfo.bulls === numInfo.actualNumber.toString().length) {
			// Hide submit button
			$('#btnSubmitNum').addClass('hidden');
			// Show start new game button
			$('#btnStartGame').removeClass('hidden');
			// Enable input text
			$('#txtNumber').prop('disabled', true);
			// Show winner message
			$('#successMsgLbl').removeClass('hidden');
		}
    });


	$('#btnStartGame').click(function() {
		// Remove all logs from info table
		$('#informationLog > tbody').html('');
		// Hide info table
		$('#informationLog').addClass('hidden');
		// Hide error/success message
		$('#errorMsgLbl').addClass('hidden');
		$('#successMsgLbl').addClass('hidden');
		// Enable input text
		$('#txtNumber').prop('disabled', false);
		// Show submit number button
		$('#btnSubmitNum').removeClass('hidden');
		// Hide start button
		$(this).addClass('hidden');

		// Send message to server
		socket.emit('start_game');
	}); 

	$('#btnSubmitNum').click(function(){
		var number = $('#txtNumber').val() * 1; 
		$('#errorMsgLbl').addClass('hidden');
		// validate number
		if(isNaN(number)) {
			$('#errorMsgLbl').removeClass('hidden');
			return;
		}

		if(number < 999) {
			$('#errorMsgLbl').removeClass('hidden');
			return;
		}

		$('#informationLog').removeClass('hidden');
		
	  	socket.emit('match_number', number);
	});  	
	  
	$('#btnEnd').click(function(){
		socket.emit('end game', '');
		$('#txtBoardSize').show('');
		
		$('#board').html('');
	});  