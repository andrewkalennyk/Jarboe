
<div class="b-j-search well none operations" style="display: none;">
	<form id="j-images-operations-form">
		<table class="table table-bordered" style="margin: 0;">
			<thead>
			<tr>
				<th width="35%">Операции</th>
			</tr>
			</thead>
			<tbody>
			<tr>
				<td>
					<div class="col-md-12">
						<div class="col-md-2">Связать с галереями</div>
						<div class="col-md-9">
							<div class="input-group">
								<select name="_joperations[galleries][]" id="galleries-operations" multiple="multiple" style="min-width: 500px; display: block; width: 100%;">
									<option value=""></option>
									@if ($galleries->count())
										@foreach($galleries as $gallery)
											<option value="{{ $gallery->id }}">{{ $gallery->title }}</option>
										@endforeach
									@endif
								</select>
							</div>
						</div>
						<div class="col-md-1">
							<a onclick="Superbox.saveImagesGalleriesRelations();" href="javascript:void(0);" class="btn btn-default btn-sm">Сохранить</a>
						</div>
					</div>
					<div class="col-md-12" style="margin-top: 20px;">
						<div class="col-md-2">Связать с тегами</div>
						<div class="col-md-9">
							<div class="input-group">
								<select name="_joperations[tags][]" id="tags-operations" multiple="multiple" style="min-width: 500px; display: block; width: 100%;">
									<option value=""></option>
									@if ($tags->count())
										@foreach($tags as $tag)
											<option value="{{ $tag->id }}">{{ $tag->title }}</option>
										@endforeach
									@endif
								</select>
							</div>
						</div>
						<div class="col-md-1">
							<a onclick="Superbox.saveImagesTagsRelations();" href="javascript:void(0);" class="btn btn-default btn-sm">Сохранить</a>
						</div>
					</div>
				</td>
			</tr>
			</tbody>
		</table>
	</form>
</div>

<script>
	jQuery(document).ready(function() {
		jQuery('#galleries-operations').select2();
		jQuery('#tags-operations').select2();
	});
</script>
