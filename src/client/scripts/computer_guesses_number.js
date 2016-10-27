var socket = io();
	
	socket.on('computer_number', function (number) {
		var rowsCount = $('#informationLog tr').length;
		$('#informationLog').append(
			'<tr>' + 
				'<td>' + rowsCount + '</td>' +
				'<td>' + number + '</td>' + 
				'<td><input class="form-control" id="txtBullsCount" type="number" /></td>' + 
				'<td><input class="form-control" id="txtCowsCount" type="number" /></td>' +
				'<td><input class="btn btn-default" id="btnSendResponse" type="button" value="Submit"/></td>' +
			'</tr>'
		);
		
		// Attach callback to send response button
		$("#btnSendResponse").click(function() {
			var cowsCount = $('#txtCowsCount').val() * 1;
			var bullsCount = $('#txtBullsCount').val() * 1;

			if(bullsCount === 4) {
				$(this).remove();
				$('#txtCowsCount').replaceWith('<span>' + cowsCount + '</span>');
				$('#txtBullsCount').replaceWith('<span>' + bullsCount + '</span>');
				$('#successMsgLbl').removeClass('hidden');	

				$("#btnStartGame").removeClass('hidden');
				$('#btnSaveNum').addClass('hidden');
				return;
			} 

			// Send message to server
			socket.emit('player_response', { cows: cowsCount, bulls: bullsCount });	
			$(this).remove();
			$('#txtCowsCount').replaceWith('<span>' + cowsCount + '</span>');
			$('#txtBullsCount').replaceWith('<span>' + bullsCount + '</span>');
		});

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
		$('#txtNumber').removeClass('hidden');
		// Show submit number button
		$('#btnSaveNum').removeClass('hidden');
		// Hide start button
		$(this).addClass('hidden');
		$('#txtNumber').val('');
		$('#txtNumber').prop('disabled', false);
	}); 

	$('#btnSaveNum').click(function(){
		$('#errorMsgLbl').addClass('hidden');
		var number = $('#txtNumber').val() * 1;
		if(isNaN(number) || number < 999) {
			$('#errorMsgLbl').removeClass('hidden');
			$('#txtNumber').val('');
			return;
		}

		$('#txtNumber').prop('disabled', true);
		$(this).addClass('hidden');

		// Show logs table
		
		$('#informationLog').removeClass('hidden');
		
		// Send message to server
		socket.emit('start_game2');
	});  	
	  
	$('#btnEnd').click(function(){
		socket.emit('end game', '');
		$('#txtBoardSize').show('');
		
		$('#board').html('');
	});  