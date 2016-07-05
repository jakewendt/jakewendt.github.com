<?xml version="1.0" encoding="UTF-8"?>
<html xsl:version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<head><style>
body {
	font-family: Calibri;
	font-size: 12pt;
	background-color: #EEEEEE
}
table {
	border-collapse: collapse;
}
table, td, th {
	border: 1px solid black;
}
table thead tr {
	background-color: #BBF;
}
tr {
	vertical-align: top;
}
th {
	text-align: left;
}
td, th {
	padding: 5px;
}
tr.question {
	border-top: 3px double black;
}
</style></head>
<body>

<p><xsl:value-of select="/study/introduction"/></p>

<h2>Questions</h2>
<table><thead><tr>
	<th>ID</th>
	<th>Title</th>
	<th colspan="2">Prompt</th>
	<th>Dependency</th>
</tr></thead><tbody>
<xsl:for-each select="/study/questions/question">
	<xsl:sort select="@ordering" data-type="number"/>
	<tr class='question'>
		<td>
			<xsl:attribute name="rowspan"><xsl:value-of select="count(option) + 1"/></xsl:attribute>
			<xsl:value-of select="@id"/></td>
		<td>
			<xsl:attribute name="rowspan"><xsl:value-of select="count(option) + 1"/></xsl:attribute>
			<xsl:value-of select="@title"/></td>
		<td>
			<xsl:attribute name="colspan">2</xsl:attribute>
			<xsl:value-of select="prompt"/></td>
		<td>
			<xsl:attribute name="rowspan"><xsl:value-of select="count(option) + 1"/></xsl:attribute>
			<xsl:value-of select="@answerReasonExpressionId"/></td>
	</tr>
	<xsl:for-each select="./option">
		<xsl:sort select="@ordering" data-type="number"/>
		<tr>
			<td><xsl:value-of select="@value"/></td>
			<td><xsl:value-of select="@name"/></td>
		</tr>
	</xsl:for-each><!-- xsl:for-each select="./option" -->
</xsl:for-each><!-- xsl:for-each select="/study/questions/question" -->
</tbody></table>

</body>
</html>
