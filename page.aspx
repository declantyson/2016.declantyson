<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/themes/ajaxy/blank.master" Inherits="mynx.themes.ajaxy.page" Codebehind="page.aspx.cs" %>

<asp:Content ID="content" ContentPlaceHolderID="ajax_content" Runat="Server">
	<div class="content" id="dynamic-content">
		<title><%= title %> | Declan Tyson, Web and Application Engineer</title>

		<script>
			params = {
				
				date: "<%= date %>"
			}
		</script>

	    <div class="bg-img-holder <%= title.ToLower().Split(':')[0] %>">
			<%= backgroundImage %>
		</div>
		<div class="content-container <%= title.ToLower().Split(':')[0] %>">
			<h1><%= title %></h1>
			<asp:Panel ID="dataPanel" runat="server">
		    </asp:Panel>
		</div>
	</div>
</asp:Content>