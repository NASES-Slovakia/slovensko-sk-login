<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@include file="/WEB-INF/html/menu.jsp" %>
<div class="container">
    ${status}
    <c:choose>
        <c:when test="${!empty sessionScope.attributes}">
            <p>
                Teraz ste prihlásení.
            </p>

            <dl>
                <dt>nameId</dt>
                <dd>${nameId}</dd>
                <dt>nameIdFormat</dt>
                <dd>${nameIdFormat}</dd>
                <dt>sessionIndex</dt>
                <dd>${sessionIndex}</dd>
                <dt>nameidNameQualifier</dt>
                <dd>${nameidNameQualifier}</dd>
                <dt>nameidSPNameQualifier</dt>
                <dd>${nameidSPNameQualifier}</dd>
                <dt>attributes</dt>
                <dd>
                    <dl>
                        <c:forEach var="attr" items="${attributes}">
                            <dt>${attr.key}</dt>
                            <dd>${attr.value}</dd>
                        </c:forEach>
                    </dl>
                </dd>
            </dl>
        </c:when>
        <c:otherwise>
            Teraz nie ste prihlásení
        </c:otherwise>
    </c:choose>

</div>
<%@include file="/WEB-INF/html/footer.jsp" %>
