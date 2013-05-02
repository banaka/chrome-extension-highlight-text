$(document).ready(function() {
	$(document.body).annotator();
	var content = $(document.body).annotator();
	content.annotator('addPlugin', 'Offline', {
		online : function() {
			jQuery("#status").text("Online");
		},
		offline : function() {
			jQuery("#status").text("Offline");
		}
	});
	var annotator = content.data('annotator');

	jQuery("#clear-storage").click(function() {
		if (annotator) {
			annotator.plugins.Offline.store.clear()
		}
	});
});
